import React, { useState } from "react";
import MortgageCalculator from "./MortgageCalculator";
import MortgageCalculatorModern from "./MortgageCalculatorModern";

/**
 * Demo component for the MortgageCalculator
 * Demonstrates how to use the MortgageCalculator component with various configurations
 */
const MortgageCalculatorDemo = () => {
  const [calculatorConfig, setCalculatorConfig] = useState({
    currency: "$",
    showAdditionalCosts: true,
    showAmortizationSchedule: true,
  });

  const [calculationResults, setCalculationResults] = useState(null);

  // Handle calculator configuration changes
  const handleConfigChange = (setting, value) => {
    setCalculatorConfig((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Handle calculation results from calculator
  const handleCalculationResults = (results) => {
    setCalculationResults(results);
  };

  return (
    <div className="mortgage-calculator-demo">
      <div className="demo-header">
        <h1 className="demo-title">Mortgage Calculator Component</h1>
        <p className="demo-description">
          A fully interactive mortgage calculator with customizable options,
          detailed payment breakdown, and amortization schedule.
        </p>
      </div>

      <div className="demo-configuration">
        <h2>Component Configuration</h2>
        <div className="config-options">
          <div className="config-option">
            <label>Currency Symbol:</label>
            <select
              value={calculatorConfig.currency}
              onChange={(e) => handleConfigChange("currency", e.target.value)}
            >
              <option value="$">$ (Dollar)</option>
              <option value="€">€ (Euro)</option>
              <option value="£">£ (Pound)</option>
              <option value="¥">¥ (Yen)</option>
              <option value="₹">₹ (Rupee)</option>
            </select>
          </div>

          <div className="config-option">
            <label>
              <input
                type="checkbox"
                checked={calculatorConfig.showAdditionalCosts}
                onChange={(e) =>
                  handleConfigChange("showAdditionalCosts", e.target.checked)
                }
              />
              Show Additional Costs (Property Tax, Insurance, etc.)
            </label>
          </div>

          <div className="config-option">
            <label>
              <input
                type="checkbox"
                checked={calculatorConfig.showAmortizationSchedule}
                onChange={(e) =>
                  handleConfigChange("showAmortizationSchedule", e.target.checked)
                }
              />
              Show Amortization Schedule
            </label>
          </div>
        </div>
      </div>

      <div className="calculator-container-demo">
        <h3>Standard Calculator</h3>
        <MortgageCalculator
          currency={calculatorConfig.currency}
          showAdditionalCosts={calculatorConfig.showAdditionalCosts}
          showAmortizationSchedule={calculatorConfig.showAmortizationSchedule}
          onCalculate={handleCalculationResults}
        />
        
        <h3 style={{ marginTop: "40px" }}>Modern Calculator with Visual Payment Breakdown</h3>
        <MortgageCalculatorModern
          currency={calculatorConfig.currency}
        />
      </div>

      {calculationResults && (
        <div className="calculation-api-results">
          <h2>Component API Results</h2>
          <p className="api-description">
            When using this component in your application, you can access the calculation 
            results through the <code>onCalculate</code> callback prop.
            Below is the data structure you would receive:
          </p>
          <div className="api-code">
            <pre>
              {JSON.stringify(calculationResults, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="usage-examples">
        <h2>Usage Examples</h2>

        <div className="code-example">
          <h3>Basic Usage</h3>
          <pre>
{`import React from "react";
import { MortgageCalculator } from "./components/mortgage-calculator";

function MyComponent() {
  return (
    <div>
      <h2>Calculate Your Mortgage</h2>
      <MortgageCalculator />
    </div>
  );
}`}
          </pre>
        </div>

        <div className="code-example">
          <h3>With Custom Configuration</h3>
          <pre>
{`import React, { useState } from "react";
import { MortgageCalculator } from "./components/mortgage-calculator";

function MyComponent() {
  const [results, setResults] = useState(null);

  const handleCalculation = (calculationResults) => {
    setResults(calculationResults);
    console.log("Monthly payment:", calculationResults.totalMonthlyPayment);
  };

  return (
    <div>
      <h2>Euro Mortgage Calculator</h2>
      <MortgageCalculator 
        currency="€"
        initialValues={{
          homePrice: 250000,
          downPayment: 50000,
          loanTerm: 25,
          interestRate: 3.5,
          propertyTax: 2000,
          homeInsurance: 800,
          pmi: 0.5,
          hoa: 100
        }}
        showAdditionalCosts={true}
        showAmortizationSchedule={true}
        onCalculate={handleCalculation}
      />
      
      {results && (
        <div>
          <h3>Total Monthly Payment: €{results.totalMonthlyPayment.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}`}
          </pre>
        </div>
      </div>

      <div className="component-features">
        <h2>Key Features</h2>
        <ul>
          <li>Interactive sliders and inputs for easy value adjustment</li>
          <li>Real-time calculation of mortgage payments</li>
          <li>Detailed breakdown of monthly payment components</li>
          <li>Full amortization schedule with principal and interest details</li>
          <li>Support for additional costs like property tax, insurance, PMI, and HOA fees</li>
          <li>Customizable currency and initial values</li>
          <li>Dynamic PMI calculation based on down payment percentage</li>
          <li>Mobile-responsive design</li>
          <li>Comprehensive API for integrating with your application</li>
        </ul>
      </div>
    </div>
  );
};

export default MortgageCalculatorDemo;
