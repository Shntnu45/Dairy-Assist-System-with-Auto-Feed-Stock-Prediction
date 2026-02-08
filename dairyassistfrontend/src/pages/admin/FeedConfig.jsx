import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './FeedConfig.css';

const FeedConfig = () => {
  const [config, setConfig] = useState({
    numberOfAnimals: 0,
    feedPerAnimalPerDay: 0,
    totalFeedStock: 0,
    monthlyFeedRequirement: 0,
    thresholdValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await adminService.getFeedConfig();
      if (data) {
        setConfig({
          numberOfAnimals: data.totalAnimals ?? 0,
          feedPerAnimalPerDay: data.feedPerAnimal ?? 0,
          totalFeedStock: data.totalStock ?? 0,
          monthlyFeedRequirement: (data.totalAnimals ?? 0) * (data.feedPerAnimal ?? 0) * 30,
          thresholdValue: data.thresholdLimit ?? 0
        });
      }
    } catch (error) {
      console.error('Error fetching feed config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        totalAnimals: config.numberOfAnimals ?? 0,
        feedPerAnimal: config.feedPerAnimalPerDay ?? 0,
        totalStock: config.totalFeedStock ?? 0,
        thresholdLimit: config.thresholdValue ?? 0
      };
      await adminService.updateFeedConfig(payload);
      alert('Feed configuration updated successfully!');
    } catch (error) {
      console.error('Error updating feed config:', error);
      alert('Failed to update feed configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleResetCycle = async () => {
    if (window.confirm('Are you sure you want to reset the feed cycle? This will recalculate all feed predictions.')) {
      try {
        await adminService.resetFeedCycle();
        alert('Feed cycle reset successfully!');
        fetchConfig(); // Refresh data
      } catch (error) {
        console.error('Error resetting feed cycle:', error);
        alert('Failed to reset feed cycle');
      }
    }
  };

  const calculateDailyConsumption = () => {
    return config.numberOfAnimals * config.feedPerAnimalPerDay;
  };

  const calculateRemainingDays = () => {
    const dailyConsumption = calculateDailyConsumption();
    return dailyConsumption > 0 ? Math.floor(config.totalFeedStock / dailyConsumption) : 0;
  };

  if (loading) {
    return <div className="loading">Loading feed configuration...</div>;
  }

  return (
    <div className="feed-config">
      <div className="page-header">
        <h1>Feed Configuration</h1>
        <p>Configure feed parameters for your dairy farm</p>
      </div>

      <div className="config-container">
        <div className="config-form-section">
          <form onSubmit={handleSubmit} className="config-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="numberOfAnimals">Number of Animals</label>
                <input
                  type="number"
                  id="numberOfAnimals"
                  name="numberOfAnimals"
                  value={config.numberOfAnimals}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <small>Total number of dairy animals</small>
              </div>

              <div className="form-group">
                <label htmlFor="feedPerAnimalPerDay">Feed per Animal per Day (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  id="feedPerAnimalPerDay"
                  name="feedPerAnimalPerDay"
                  value={config.feedPerAnimalPerDay}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <small>Average feed consumption per animal daily</small>
              </div>

              <div className="form-group">
                <label htmlFor="totalFeedStock">Total Feed Stock (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  id="totalFeedStock"
                  name="totalFeedStock"
                  value={config.totalFeedStock}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <small>Current available feed stock</small>
              </div>

              <div className="form-group">
                <label htmlFor="monthlyFeedRequirement">Monthly Feed Requirement (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  id="monthlyFeedRequirement"
                  name="monthlyFeedRequirement"
                  value={config.monthlyFeedRequirement}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <small>Expected monthly feed consumption</small>
              </div>

              <div className="form-group">
                <label htmlFor="thresholdValue">Threshold Value (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  id="thresholdValue"
                  name="thresholdValue"
                  value={config.thresholdValue}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <small>Minimum stock level for reorder alert</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
              <button type="button" onClick={handleResetCycle} className="btn btn-secondary">
                Reset Feed Cycle
              </button>
            </div>
          </form>
        </div>

        <div className="calculations-section">
          <h3>Calculated Values</h3>
          <div className="calc-cards">
            <div className="calc-card">
              <div className="calc-icon">📊</div>
              <div className="calc-content">
                <h4>Daily Consumption</h4>
                <p>{calculateDailyConsumption()} kg</p>
              </div>
            </div>
            <div className="calc-card">
              <div className="calc-icon">📅</div>
              <div className="calc-content">
                <h4>Remaining Days</h4>
                <p>{calculateRemainingDays()} days</p>
              </div>
            </div>
            <div className="calc-card">
              <div className="calc-icon">⚠️</div>
              <div className="calc-content">
                <h4>Reorder Alert</h4>
                <p>{config.totalFeedStock <= config.thresholdValue ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedConfig;