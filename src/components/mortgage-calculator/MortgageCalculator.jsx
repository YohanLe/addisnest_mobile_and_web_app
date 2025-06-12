import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * MortgageCalculator Component
 * A comprehensive mortgage calculator with interactive inputs and detailed payment breakdown
 */
const MortgageCalculator = ({
  currency = "$",
  initialValues = {
    homePrice: 300000,
    downPayment: 60000,
    loanTerm: 30,
    interestRate: 4.5,
    propertyTax: 3000,
    homeInsurance: 1000,
    pmi: 0.5,
    hoa: 0
  },
  showAdditionalCosts = true,
  showAmortizationSchedule = true,
  onCalculate = null,
  customConfig = {}
}) => {
  // State for input values
  // Get custom configuration or use defaults
  const config = {
    interestRateMax: 100,
    downPaymentPercentMax: 1000,
    homePriceEditable: false,
    ...customConfig
  };

  const [homePrice, setHomePrice] = useState(initialValues.homePrice);
  const [downPayment, setDownPayment] = useState(initialValues.downPayment);
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    (initialValues.downPayment / initialValues.homePrice) * 100
  );
  const [loanTerm, setLoanTerm] = useState(initialValues.loanTerm);
  const [interestRate, setInterestRate] = useState(initialValues.interestRate);
  const [propertyTax, setPropertyTax] = useState(initialValues.propertyTax);
  const [homeInsurance, setHomeInsurance] = useState(initialValues.homeInsurance);
  const [pmi, setPmi] = useState(initialValues.pmi);
  const [hoa, setHoa] = useState(initialValues.hoa);

  // State for calculated results
  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyPrincipalInterest, setMonthlyPrincipalInterest] = useState(0);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(0);
  const [monthlyHomeInsurance, setMonthlyHomeInsurance] = useState(0);
  const [monthlyPmi, setMonthlyPmi] = useState(0);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);
  const [showFullAmortization, setShowFullAmortization] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  // Calculate mortgage details when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [
    homePrice,
    downPayment,
    loanTerm,
    interestRate,
    propertyTax,
    homeInsurance,
    pmi,
    hoa
  ]);

  // Keep downPayment and downPaymentPercent in sync
  const updateDownPayment = (value) => {
    setDownPayment(value);
    setDownPaymentPercent(((value / homePrice) * 100).toFixed(2));
  };

  // Keep downPaymentPercent and downPayment in sync
  const updateDownPaymentPercent = (percent) => {
    setDownPaymentPercent(percent);
    setDownPayment((homePrice * percent) / 100);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return currency + amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // Calculate monthly mortgage payment
  const calculateMonthlyPayment = (principal, years, rate) => {
    const monthlyRate = rate / 100 / 12;
    const payments = years * 12;
    
    // If rate is 0, simply divide principal by number of payments
    if (rate === 0) {
      return principal / payments;
    }
    
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1)
    );
  };

  // Calculate amortization schedule
  const calculateAmortizationSchedule = (principal, years, rate) => {
    const monthlyRate = rate / 100 / 12;
    const payments = years * 12;
    const monthlyPayment = calculateMonthlyPayment(principal, years, rate);
    const schedule = [];
    
    let balance = principal;
    let totalInterest = 0;
    
    for (let i = 1; i <= payments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      totalInterest += interestPayment;
      balance -= principalPayment;
      
      // Only add certain intervals to reduce data size
      if (i <= 12 || i % 12 === 0 || i === payments) {
        schedule.push({
          payment: i,
          monthlyPayment: monthlyPayment,
          principalPayment: principalPayment,
          interestPayment: interestPayment,
          totalInterest: totalInterest,
          balance: balance > 0 ? balance : 0
        });
      }
    }
    
    return schedule;
  };

  // Calculate all mortgage details
  const calculateMortgage = () => {
    // Calculate loan amount
    const calculatedLoanAmount = homePrice - downPayment;
    setLoanAmount(calculatedLoanAmount);
    
    // Calculate monthly principal and interest payment
    const monthlyPI = calculateMonthlyPayment(
      calculatedLoanAmount,
      loanTerm,
      interestRate
    );
    setMonthlyPrincipalInterest(monthlyPI);
    
    // Calculate monthly property tax
    const monthlyPT = propertyTax / 12;
    setMonthlyPropertyTax(monthlyPT);
    
    // Calculate monthly home insurance
    const monthlyHI = homeInsurance / 12;
    setMonthlyHomeInsurance(monthlyHI);
    
    // Calculate monthly PMI (only if down payment < 20%)
    let monthlyPMI = 0;
    if (downPaymentPercent < 20) {
      monthlyPMI = (calculatedLoanAmount * (pmi / 100)) / 12;
    }
    setMonthlyPmi(monthlyPMI);
    
    // Monthly HOA
    setMonthlyHoa(hoa);
    
    // Calculate total monthly payment
    const total = monthlyPI + monthlyPT + monthlyHI + monthlyPMI + hoa;
    setTotalMonthlyPayment(total);
    
    // Generate amortization schedule
    const schedule = calculateAmortizationSchedule(
      calculatedLoanAmount,
      loanTerm,
      interestRate
    );
    setAmortizationSchedule(schedule);
    
    // Call the onCalculate callback if provided
    if (onCalculate) {
      onCalculate({
        loanAmount: calculatedLoanAmount,
        monthlyPrincipalInterest: monthlyPI,
        monthlyPropertyTax: monthlyPT,
        monthlyHomeInsurance: monthlyHI,
        monthlyPmi: monthlyPMI,
        monthlyHoa: hoa,
        totalMonthlyPayment: total,
        amortizationSchedule: schedule
      });
    }
  };

  // Handle input changes
  const handleInputChange = (setter) => (e) => {
    const value = parseFloat(e.target.value) || 0;
    setter(value);
  };

  return (
    <div className="mortgage-calculator">
      <div className="calculator-container">
        <div className="calculator-inputs">
          <h2 className="calculator-title">Mortgage Calculator</h2>
          
          <div className="input-group">
            <label htmlFor="home-price">Home Price</label>
            <div className="input-with-prefix">
              <span className="input-prefix">{currency}</span>
              <input
                id="home-price"
                type="number"
                value={homePrice}
                onChange={handleInputChange(setHomePrice)}
                min="0"
                step="1000"
                readOnly={!config.homePriceEditable}
              />
            </div>
            <input
              type="range"
              value={homePrice}
              onChange={handleInputChange(setHomePrice)}
              min="50000"
              max="2000000"
              step="10000"
              className="range-slider"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="down-payment">Down Payment</label>
            <div className="input-wrapper">
              <div className="input-with-prefix">
                <span className="input-prefix">{currency}</span>
                <input
                  id="down-payment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => updateDownPayment(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1000"
                />
              </div>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => updateDownPaymentPercent(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="input-suffix">%</span>
              </div>
            </div>
            <input
              type="range"
              value={downPaymentPercent}
              onChange={(e) => updateDownPaymentPercent(parseFloat(e.target.value))}
              min="0"
              max={config.downPaymentPercentMax}
              step="1"
              className="range-slider"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="loan-term">Loan Term (years)</label>
            <select
              id="loan-term"
              value={loanTerm}
              onChange={handleInputChange(setLoanTerm)}
            >
              <option value="30">30 years</option>
              <option value="20">20 years</option>
              <option value="15">15 years</option>
              <option value="10">10 years</option>
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor="interest-rate">Interest Rate (%)</label>
            <div className="input-with-suffix">
              <input
                id="interest-rate"
                type="number"
                value={interestRate}
                onChange={handleInputChange(setInterestRate)}
                min="0"
                max="20"
                step="0.01"
              />
              <span className="input-suffix">%</span>
            </div>
            <input
              type="range"
              value={interestRate}
              onChange={handleInputChange(setInterestRate)}
              min="0"
              max={config.interestRateMax}
              step="0.05"
              className="range-slider"
            />
          </div>
          
          {showAdditionalCosts && (
            <div className="additional-costs">
              <h3 className="section-title">Additional Costs</h3>
              
              <div className="input-group">
                <label htmlFor="property-tax">Annual Property Tax</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">{currency}</span>
                  <input
                    id="property-tax"
                    type="number"
                    value={propertyTax}
                    onChange={handleInputChange(setPropertyTax)}
                    min="0"
                    step="100"
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="home-insurance">Annual Home Insurance</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">{currency}</span>
                  <input
                    id="home-insurance"
                    type="number"
                    value={homeInsurance}
                    onChange={handleInputChange(setHomeInsurance)}
                    min="0"
                    step="100"
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="pmi">PMI Rate (%)</label>
                <div className="input-with-suffix">
                  <input
                    id="pmi"
                    type="number"
                    value={pmi}
                    onChange={handleInputChange(setPmi)}
                    min="0"
                    max="2"
                    step="0.01"
                    disabled={downPaymentPercent >= 20}
                  />
                  <span className="input-suffix">%</span>
                </div>
                {downPaymentPercent >= 20 && (
                  <div className="info-text">No PMI required with 20%+ down payment</div>
                )}
              </div>
              
              <div className="input-group">
                <label htmlFor="hoa">Monthly HOA</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">{currency}</span>
                  <input
                    id="hoa"
                    type="number"
                    value={hoa}
                    onChange={handleInputChange(setHoa)}
                    min="0"
                    step="10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="calculator-results">
          <div className="result-summary">
            <h3 className="section-title">Monthly Payment</h3>
            <div className="total-payment">{formatCurrency(totalMonthlyPayment)}</div>
            
            <div className="payment-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-label">Principal & Interest</div>
                <div className="breakdown-value">{formatCurrency(monthlyPrincipalInterest)}</div>
              </div>
              
              {showAdditionalCosts && (
                <>
                  <div className="breakdown-item">
                    <div className="breakdown-label">Property Tax</div>
                    <div className="breakdown-value">{formatCurrency(monthlyPropertyTax)}</div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-label">Home Insurance</div>
                    <div className="breakdown-value">{formatCurrency(monthlyHomeInsurance)}</div>
                  </div>
                  
                  {downPaymentPercent < 20 && (
                    <div className="breakdown-item">
                      <div className="breakdown-label">PMI</div>
                      <div className="breakdown-value">{formatCurrency(monthlyPmi)}</div>
                    </div>
                  )}
                  
                  {hoa > 0 && (
                    <div className="breakdown-item">
                      <div className="breakdown-label">HOA</div>
                      <div className="breakdown-value">{formatCurrency(monthlyHoa)}</div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="loan-summary">
              <div className="summary-item">
                <div className="summary-label">Loan Amount</div>
                <div className="summary-value">{formatCurrency(loanAmount)}</div>
              </div>
              
              <div className="summary-item">
                <div className="summary-label">Loan-to-Value</div>
                <div className="summary-value">
                  {((loanAmount / homePrice) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
          
          {showAmortizationSchedule && (
            <div className="amortization-section">
              <h3 className="section-title">Amortization Schedule</h3>
              
              <div className="amortization-toggle">
                <button
                  onClick={() => setShowFullAmortization(!showFullAmortization)}
                  className="toggle-button"
                >
                  {showFullAmortization ? "Show Less" : "Show Full Schedule"}
                </button>
              </div>
              
              {showFullAmortization && (
                <div className="amortization-table-container">
                  <table className="amortization-table">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Total Interest</th>
                        <th>Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.map((entry) => (
                        <tr key={entry.payment}>
                          <td>{Math.ceil(entry.payment / 12)}</td>
                          <td>{formatCurrency(entry.principalPayment)}</td>
                          <td>{formatCurrency(entry.interestPayment)}</td>
                          <td>{formatCurrency(entry.totalInterest)}</td>
                          <td>{formatCurrency(entry.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {!showFullAmortization && amortizationSchedule.length > 0 && (
                <div className="amortization-preview">
                  <div className="preview-year">
                    <div className="preview-label">End of Year 1</div>
                    <div className="preview-value">
                      {formatCurrency(amortizationSchedule[0]?.balance || 0)}
                    </div>
                  </div>
                  
                  <div className="preview-year">
                    <div className="preview-label">End of Year 5</div>
                    <div className="preview-value">
                      {formatCurrency(
                        amortizationSchedule.find(entry => entry.payment === 60)?.balance || 0
                      )}
                    </div>
                  </div>
                  
                  <div className="preview-year">
                    <div className="preview-label">End of Year 10</div>
                    <div className="preview-value">
                      {formatCurrency(
                        amortizationSchedule.find(entry => entry.payment === 120)?.balance || 0
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MortgageCalculator.propTypes = {
  currency: PropTypes.string,
  initialValues: PropTypes.shape({
    homePrice: PropTypes.number,
    downPayment: PropTypes.number,
    loanTerm: PropTypes.number,
    interestRate: PropTypes.number,
    propertyTax: PropTypes.number,
    homeInsurance: PropTypes.number,
    pmi: PropTypes.number,
    hoa: PropTypes.number
  }),
  showAdditionalCosts: PropTypes.bool,
  showAmortizationSchedule: PropTypes.bool,
  onCalculate: PropTypes.func
};

export default MortgageCalculator;
