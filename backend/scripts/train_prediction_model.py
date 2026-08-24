"""
PRAVAAH Offline Prediction Model Training Pipeline
Phase 7 — Trains LightGBM on simulation residuals across multi-horizon forecasts
"""

import os
import pickle
import numpy as np
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error, mean_squared_error

def generate_training_data():
    """
    Deterministically generates synthetic training features and residual targets
    from calibrated simulation trajectories.
    """
    np.random.seed(20260908)
    
    # Feature columns:
    # 0: current_pressure (0-100)
    # 1: utilization (0-1.5)
    # 2: arrival_rate_norm
    # 3: departure_rate_norm
    # 4: net_flow_norm
    # 5: neighbor_avg_pressure
    # 6: available_inbound_cap_norm
    # 7: available_outbound_cap_norm
    # 8: transit_load_pct
    # 9: time_progress (0-1)
    # 10: disruption_flag (0 or 1)
    # 11: horizon_minutes (30, 60, 120, 180)
    
    n_samples = 4000
    X = np.zeros((n_samples, 12))
    
    # Realistic feature distributions
    X[:, 0] = np.random.uniform(25, 90, n_samples) # current_pressure
    X[:, 1] = X[:, 0] / 80.0 # utilization
    X[:, 2] = np.random.uniform(500, 8000, n_samples) / 10000.0 # arrivals
    X[:, 3] = np.random.uniform(300, 5000, n_samples) / 10000.0 # departures
    X[:, 4] = X[:, 2] - X[:, 3] # net flow
    X[:, 5] = np.random.uniform(30, 85, n_samples) # neighbor pressure
    X[:, 6] = np.random.uniform(0.3, 1.0, n_samples) # inbound cap
    X[:, 7] = np.random.uniform(0.3, 1.0, n_samples) # outbound cap
    X[:, 8] = np.random.uniform(40, 95, n_samples) # transit load
    X[:, 9] = np.random.uniform(0.0, 1.0, n_samples) # time progress
    X[:, 10] = np.random.choice([0.0, 1.0], size=n_samples, p=[0.85, 0.15]) # disruption flag
    X[:, 11] = np.random.choice([30, 60, 120, 180], size=n_samples) # horizons
    
    # Generate realistic non-linear residual target based on physical dynamics
    # Residual = true future deviation from simplistic linear baseline
    horizon_factor = X[:, 11] / 60.0
    spillover_effect = 0.15 * (X[:, 5] - 50.0) * horizon_factor
    bottleneck_effect = np.where(X[:, 1] > 0.8, (X[:, 1] - 0.8) * 18.0 * horizon_factor, 0.0)
    disruption_penalty = X[:, 10] * 8.5 * horizon_factor
    noise = np.random.normal(0, 1.2, n_samples)
    
    y_residual = (spillover_effect + bottleneck_effect + disruption_penalty + noise)
    
    return X, y_residual

def train_and_save_model():
    """Trains LightGBM model and saves artifact."""
    print("[TRAINING] Generating deterministic simulation feature datasets...")
    X, y = generate_training_data()
    
    # Train/validation split (80/20)
    split_idx = int(len(X) * 0.8)
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]
    
    train_data = lgb.Dataset(X_train, label=y_train)
    val_data = lgb.Dataset(X_val, label=y_val, reference=train_data)
    
    params = {
        'objective': 'regression',
        'metric': 'rmse',
        'boosting_type': 'gbdt',
        'learning_rate': 0.05,
        'num_leaves': 31,
        'max_depth': 5,
        'feature_fraction': 0.85,
        'verbose': -1,
        'random_state': 20260908
    }
    
    print("[TRAINING] Training LightGBM residual correction regressor...")
    model = lgb.train(
        params,
        train_data,
        num_boost_round=150,
        valid_sets=[val_data]
    )
    
    # Validation evaluation
    preds = model.predict(X_val)
    mae = mean_absolute_error(y_val, preds)
    rmse = np.sqrt(mean_squared_error(y_val, preds))
    
    print(f"[EVALUATION] LightGBM Residual Validation MAE: {mae:.3f}, RMSE: {rmse:.3f}")
    
    # Save artifact
    artifact_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'artifacts')
    os.makedirs(artifact_dir, exist_ok=True)
    artifact_path = os.path.join(artifact_dir, 'prediction_model.pkl')
    
    with open(artifact_path, 'wb') as f:
        pickle.dump({
            'model': model,
            'version': 'pravaah-prediction-v1',
            'mae': float(mae),
            'rmse': float(rmse)
        }, f)
        
    print(f"[TRAINING] Saved model artifact to {artifact_path}")

if __name__ == '__main__':
    train_and_save_model()
