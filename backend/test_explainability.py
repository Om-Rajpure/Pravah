"""
PRAVAAH Explainability & Decision Audit Test Suite
Phase 10 Validation
"""

import unittest
from app import create_app
from services.explainability_service import get_explainability_engine
from services.prediction_service import get_predictor
from services.intervention_service import get_intervention_engine

class TestExplainabilityEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.engine = get_explainability_engine()
        cls.predictor = get_predictor()
        cls.intervention = get_intervention_engine()

    def test_01_prediction_explanation_structure_and_trace(self):
        """Verify forecast explanation includes structured trace, drivers, confidence, and assumptions."""
        exp = self.engine.explain_prediction("curry-road")
        self.assertEqual(exp.type, "PREDICTION")
        self.assertIn("PRV-PRED-CURRY-ROAD", exp.decision_id)
        self.assertGreater(len(exp.why), 0)
        self.assertGreater(len(exp.assumptions), 0)
        self.assertGreater(len(exp.limitations), 0)
        self.assertGreater(len(exp.data_sources), 0)

        # Check trace stages
        stages = [t.stage for t in exp.trace]
        self.assertIn("CURRENT_STATE", stages)
        self.assertIn("SIGNALS", stages)
        self.assertIn("FORECAST", stages)

    def test_02_intervention_explanation_and_truthfulness(self):
        """
        Verify action explanation matches ground-truth mathematical computation.
        Reduction MUST equal target_before - target_after.
        """
        exp = self.engine.explain_intervention()
        self.assertEqual(exp.type, "INTERVENTION")
        self.assertIn("PRV-ACT", exp.decision_id)
        self.assertGreater(len(exp.why), 0)

        # Truthfulness check
        imp = exp.impact
        self.assertEqual(
            imp["target_before"] - imp["target_after"],
            imp["reduction"],
            "Explanation hallucinated a pressure reduction mismatch!"
        )

        # Trace stages
        stages = [t.stage for t in exp.trace]
        self.assertIn("CANDIDATE_ACTIONS", stages)
        self.assertIn("CONSTRAINT_CHECK", stages)
        self.assertIn("DECISION", stages)

    def test_03_audit_trail_and_lineage(self):
        """Verify chronological decision audit trail logging and lineage tracking."""
        trail = self.engine.get_audit_trail()
        self.assertGreaterEqual(len(trail), 2)

        # Record a test event
        ev = self.engine.record_audit_event(
            event_type='ACTION_SIMULATED',
            decision_id='PRV-ACT-SIM-001',
            parent_decision_id='PRV-ACT-REDIRECT-CURRY-ROAD-THANE-18',
            summary='Simulated 18% redirection action impact.',
            reason='Counterfactual evaluation completed.'
        )
        self.assertEqual(ev.parent_decision_id, 'PRV-ACT-REDIRECT-CURRY-ROAD-THANE-18')

        trail_updated = self.engine.get_audit_trail('ACTION_SIMULATED')
        self.assertGreaterEqual(len(trail_updated), 1)
        self.assertEqual(trail_updated[0]['decision_id'], 'PRV-ACT-SIM-001')

    def test_04_explainability_api_endpoints(self):
        """Test explainability and audit HTTP REST endpoints."""
        # 1. Prediction explanation
        res_p = self.client.get('/api/explanations/prediction/curry-road')
        self.assertEqual(res_p.status_code, 200)
        self.assertIn("trace", res_p.get_json())

        # 2. Technical detail mode
        res_tech = self.client.get('/api/explanations/prediction/curry-road?detail=technical')
        self.assertEqual(res_tech.status_code, 200)
        self.assertIn("technical_context", res_tech.get_json())

        # 3. Intervention explanation
        res_i = self.client.get('/api/explanations/intervention')
        self.assertEqual(res_i.status_code, 200)
        self.assertIn("impact", res_i.get_json())

        # 4. Audit trail
        res_audit = self.client.get('/api/audit')
        self.assertEqual(res_audit.status_code, 200)
        self.assertIsInstance(res_audit.get_json(), list)

if __name__ == '__main__':
    unittest.main()
