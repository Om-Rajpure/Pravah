"""
PRAVAAH Demo Mode Service
Phase 12 — Deterministic demo reset, status, and event sequencing
"""

import logging
from typing import Dict, Any, List

from config import Config
from services.simulator import get_simulator
from services.network_service import get_network
from services.scenario_service import get_scenario_engine
from services.prediction_service import get_predictor
from services.intervention_service import get_intervention_engine
from services.explainability_service import get_explainability_engine

logger = logging.getLogger('pravaah.demo')

DEMO_VERSION = '1.0.0'

# Canonical demo event sequence — maps to the full PRAVAAH story
DEMO_EVENTS = [
    {
        'id': 'T00_normal',
        'label': 'Normal Conditions',
        'description': 'City at baseline — 18:00, simulation running',
        'sim_steps': 0,
        'scenario': None,
    },
    {
        'id': 'T15_rising',
        'label': 'Pressure Rising',
        'description': 'Curry Road pressure begins climbing toward forecast threshold',
        'sim_steps': 3,   # 3 × 5-min steps = 15 minutes
        'scenario': None,
    },
    {
        'id': 'T30_warning',
        'label': 'Forecast Warning',
        'description': 'Prediction engine issues 2-hour HIGH forecast for Curry Road',
        'sim_steps': 6,
        'scenario': None,
    },
    {
        'id': 'T50_recommendation',
        'label': 'Recommendation Ready',
        'description': 'PRAVAAH recommends: Redirect 18% → Thane/Vashi',
        'sim_steps': 10,
        'scenario': None,
    },
    {
        'id': 'T60_disruption',
        'label': 'Central Line Disruption',
        'description': 'Scenario injected: Central Railway disruption cascades across network',
        'sim_steps': 12,
        'scenario': 'central-line-disruption',
    },
    {
        'id': 'T80_recovery',
        'label': 'New Recommendation',
        'description': 'Network updates, prediction refreshes, new recommendation generated',
        'sim_steps': 16,
        'scenario': 'central-line-disruption',
    },
]

_current_event_index = 0
_demo_active = True


class DemoService:
    def __init__(self):
        self.current_event_index = 0
        self.demo_active = True

    def get_status(self) -> Dict[str, Any]:
        sim = get_simulator()
        network = get_network()
        scenario = get_scenario_engine()
        return {
            'demo_active': self.demo_active,
            'demo_version': DEMO_VERSION,
            'demo_seed': Config.DEMO_SEED,
            'current_event': DEMO_EVENTS[self.current_event_index],
            'current_event_index': self.current_event_index,
            'total_events': len(DEMO_EVENTS),
            'simulation_time': sim.get_state().get('simulation_time', '18:00'),
            'simulation_status': sim.get_state().get('status', 'PAUSED'),
            'network_version': network.version,
            'active_scenario': scenario.get_current_scenario().get('active_scenario_id'),
            'is_final_event': self.current_event_index >= len(DEMO_EVENTS) - 1,
        }

    def reset(self) -> Dict[str, Any]:
        """Full atomic demo reset — restores every service to canonical baseline."""
        logger.info('[DEMO] Full reset to baseline (DEMO_SEED=%s)', Config.DEMO_SEED)

        # 1. Reset scenario to baseline
        scenario = get_scenario_engine()
        scenario.reset_scenario()

        # 2. Reset network
        network = get_network()
        network.reset()

        # 3. Reset simulator
        sim = get_simulator()
        sim.reset()

        # 4. Clear predictor history
        predictor = get_predictor()
        predictor.history_snapshots.clear()
        predictor.cache.clear()

        # 5. Reset explainability seed events
        explain = get_explainability_engine()
        explain._reset_seed_events()

        self.current_event_index = 0
        self.demo_active = True

        logger.info('[DEMO] Reset complete — all services at baseline')
        return self.get_status()

    def next_event(self) -> Dict[str, Any]:
        """Advance to next demo event — applies sim steps and scenario as needed."""
        if self.current_event_index >= len(DEMO_EVENTS) - 1:
            return {**self.get_status(), 'message': 'Already at final event. Use reset to restart.'}

        self.current_event_index += 1
        event = DEMO_EVENTS[self.current_event_index]
        logger.info('[DEMO] Advancing to event %s: %s', self.current_event_index, event['label'])

        sim = get_simulator()
        scenario_engine = get_scenario_engine()
        network = get_network()

        # Apply simulation steps for this event
        prev_steps = DEMO_EVENTS[self.current_event_index - 1].get('sim_steps', 0)
        new_steps = event.get('sim_steps', prev_steps)
        steps_to_run = new_steps - prev_steps

        for _ in range(steps_to_run):
            sim.step()

        # Apply scenario if needed
        if event['scenario']:
            scenario_engine.activate_scenario(event['scenario'])
        else:
            scenario_engine.reset_scenario()
            network.reset()

        # Clear prediction cache so it regenerates from new state
        predictor = get_predictor()
        predictor.cache.clear()

        return {**self.get_status(), 'event_applied': event}


_global_demo: DemoService = None

def get_demo_service() -> DemoService:
    global _global_demo
    if _global_demo is None:
        _global_demo = DemoService()
    return _global_demo
