import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Enhanced Mortgage Calculator Component
 * A comprehensive mortgage calculator with modern styling, mobile responsiveness,
 * and support for Ethiopian Birr (ETB) and other currencies
 * Branch: 0617_newBranch
 */
const SimpleMortgageCalculator = ({
  currency = "ETB",
  initialValues = {
    homePrice: 15200000,
    downPayment: 3040000,
    loanTerm: 20,
    interestRate: 10,
    propertyTax: 19000,
    homeInsurance: 2533.33,
    pmi: 0.5,
    hoa: 500
  },
  customConfig = {}
}) => {
  // Get custom configuration or use defaults
  const config = {
    interestRateMax: 20,
    downPaymentPercentMax: 100,
    homePriceEditable: true,
    ...customConfig
  };

  // Available currencies
  const currencies = [
    { code: "ETB", symbol: "ETB", name: "Ethiopian Birr" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" }
  ];
  
  // Find the current currency object
  const [selectedCurrency, setSelectedCurrency] = useState(
    currencies.find(c => c.code === currency) || currencies[0]
  );
  
  // State for input values
  const [homePrice, setHomePrice] = useState(initialValues.homePrice);
  const [downPayment, setDownPayment] = useState(initialValues.downPayment);
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    ((initialValues.downPayment / initialValues.homePrice) * 100).toFixed(1)
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
  const [showAmortizationSchedule, setShowAmortizationSchedule] = useState(false);
  const [amortizationData, setAmortizationData] = useState([]);

  // Initialize calculation on component mount
  useEffect(() => {
    // Initial calculation when component mounts
    calculateMortgage();
  }, []);

  // Keep downPayment and downPaymentPercent in sync
  const updateDownPayment = (value) => {
    setDownPayment(value);
    setDownPaymentPercent(((value / homePrice) * 100).toFixed(1));
  };

  // Keep downPaymentPercent and downPayment in sync
  const updateDownPaymentPercent = (percent) => {
    setDownPaymentPercent(percent);
    setDownPayment((homePrice * percent) / 100);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return selectedCurrency.symbol + " " + amount.toLocaleString(undefined, {
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
    const numberOfPayments = years * 12;
    const monthlyPayment = calculateMonthlyPayment(principal, years, rate);
    
    let balance = principal;
    let schedule = [];
    
    for (let i = 1; i <= numberOfPayments; i++) {
      // Calculate interest for this period
      const interestPayment = balance * monthlyRate;
      
      // Calculate principal for this period
      const principalPayment = monthlyPayment - interestPayment;
      
      // Update remaining balance
      balance -= principalPayment;
      
      // Add to schedule (only adding yearly entries to keep it manageable)
      if (i % 12 === 0) {
        schedule.push({
          payment: i,
          year: i / 12,
          principalPayment: principalPayment,
          interestPayment: interestPayment,
          totalPayment: monthlyPayment,
          remainingBalance: balance > 0 ? balance : 0
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
    const schedule = calculateAmortizationSchedule(calculatedLoanAmount, loanTerm, interestRate);
    setAmortizationData(schedule);
  };

  // Reset calculator to initial values
  const resetCalculator = () => {
    setHomePrice(initialValues.homePrice);
    setDownPayment(initialValues.downPayment);
    setDownPaymentPercent(((initialValues.downPayment / initialValues.homePrice) * 100).toFixed(1));
    setLoanTerm(initialValues.loanTerm);
    setInterestRate(initialValues.interestRate);
    setPropertyTax(initialValues.propertyTax);
    setHomeInsurance(initialValues.homeInsurance);
    setPmi(initialValues.pmi);
    setHoa(initialValues.hoa);
    calculateMortgage();
  };

  // Toggle amortization schedule visibility
  const toggleAmortizationSchedule = () => {
    setShowAmortizationSchedule(!showAmortizationSchedule);
  };

  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '20px auto'
    }}>
      {/* Header with version info */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <h2 style={{ margin: '0 20px 0 0', color: '#333' }}>Enhanced Mortgage Calculator</h2>
        <div style={{
          backgroundColor: '#4a6cf7',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          Branch: 0617_newBranch
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Left Column - Inputs */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          {/* Currency Selector */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '10px',
              color: '#333'
            }}>
              Currency
            </label>
            <select
              value={selectedCurrency.code}
              onChange={(e) => {
                const selected = currencies.find(c => c.code === e.target.value);
                if (selected) setSelectedCurrency(selected);
              }}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>
          
          {/* Home Price */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '10px',
              color: '#333'
            }}>
              Home Price
            </label>
            <input
              type="text"
              value={homePrice.toLocaleString()}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setHomePrice(Number(value));
              }}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            />
          </div>

          {/* Down Payment */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '10px',
              color: '#333'
            }}>
              Down Payment
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={downPayment.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  updateDownPayment(Number(value));
                }}
                style={{
                  flex: '2',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              />
              <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5'
              }}>
                <input
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => updateDownPaymentPercent(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  style={{
                    width: '60%',
                    textAlign: 'right',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                />
                <span style={{ marginLeft: '5px' }}>%</span>
              </div>
            </div>
          </div>

          {/* Interest Rate */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '10px',
              color: '#333'
            }}>
              Interest Rate
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              <input
                type="text"
                value={interestRate}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = parseFloat(value);
                  setInterestRate(isNaN(numericValue) ? value : numericValue);
                }}
                placeholder="Enter interest rate"
                style={{
                  flex: '1',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              />
              <span style={{ marginLeft: '5px' }}>%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '10px',
              color: '#333'
            }}>
              Loan Term (years)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <option value="30">30 years</option>
              <option value="20">20 years</option>
              <option value="15">15 years</option>
              <option value="10">10 years</option>
            </select>
          </div>
        </div>

        {/* Right Column - Results */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '25px',
            height: '100%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            {/* Payment Calculator Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#333' }}>Payment Calculator</h2>
              <button
                onClick={resetCalculator}
                style={{
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 15px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ marginRight: '5px', fontWeight: '500' }}>Reset</span>
                <span>↻</span>
              </button>
            </div>

            <p style={{ margin: '0 0 20px 0', color: '#666' }}>
              Estimate Costs for this home {formatCurrency(totalMonthlyPayment)}/month
            </p>

            {/* Payment Visualization - Enhanced */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '20px 0',
              padding: '25px',
              background: 'linear-gradient(135deg, #4a6cf7 0%, #2a4cd7 100%)',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(74, 108, 247, 0.2)'
            }}>
              <div style={{ fontSize: '14px', color: '#ffffff', marginBottom: '8px', opacity: '0.9' }}>
                Estimated Monthly Payment
              </div>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: 'white', 
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {formatCurrency(totalMonthlyPayment)}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#ffffff', 
                opacity: '0.9',
                padding: '5px 15px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.2)',
                marginTop: '5px'
              }}>
                For {loanTerm} years at {interestRate}% interest
              </div>
            </div>

            {/* Payment Breakdown */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>Payment Breakdown</h3>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ color: '#666' }}>Principal & Interest</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(monthlyPrincipalInterest)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ color: '#666' }}>Property Taxes</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(monthlyPropertyTax)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ color: '#666' }}>Home Insurance</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(monthlyHomeInsurance)}</span>
              </div>
              
              {downPaymentPercent < 20 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: '#666' }}>Mortgage Insurance</span>
                  <span style={{ fontWeight: '500' }}>{formatCurrency(monthlyPmi)}</span>
                </div>
              )}
              
              {hoa > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: '#666' }}>HOA Fee</span>
                  <span style={{ fontWeight: '500' }}>{formatCurrency(monthlyHoa)}</span>
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '15px 0',
                marginTop: '5px',
                borderTop: '2px solid #eee',
                fontWeight: 'bold'
              }}>
                <span>Total Monthly Payment</span>
                <span>{formatCurrency(totalMonthlyPayment)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={calculateMortgage}
                style={{
                  flex: '1',
                  backgroundColor: '#4a6cf7',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  padding: '15px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a5ce7'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a6cf7'}>
                Calculate
              </button>
              
              <button
                onClick={toggleAmortizationSchedule}
                style={{
                  flex: '1',
                  backgroundColor: showAmortizationSchedule ? '#f44336' : '#00796b',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  padding: '15px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = showAmortizationSchedule ? '#d32f2f' : '#00695c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = showAmortizationSchedule ? '#f44336' : '#00796b'}>
                {showAmortizationSchedule ? 'Hide Schedule' : 'Show Amortization'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      {showAmortizationSchedule && (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginTop: '30px'
        }}>
          <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>
            Amortization Schedule
          </h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            This table shows how your loan balance decreases over time. The schedule displays one entry per year for simplicity.
          </p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f5f7fa',
                  color: '#333',
                  fontWeight: 'bold'
                }}>
                  <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Year</th>
                  <th style={{ padding: '12px 15px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Principal Payment</th>
                  <th style={{ padding: '12px 15px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Interest Payment</th>
                  <th style={{ padding: '12px 15px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Total Payment</th>
                  <th style={{ padding: '12px 15px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationData.map((yearData, index) => (
                  <tr key={index} style={{ 
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                  }}>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{yearData.year}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatCurrency(yearData.principalPayment * 12)}
                    </td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatCurrency(yearData.interestPayment * 12)}
                    </td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatCurrency(yearData.totalPayment * 12)}
                    </td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatCurrency(yearData.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ 
            marginTop: '25px',
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            color: '#2e7d32'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              Loan Summary
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>Loan Amount</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{formatCurrency(loanAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>Total Interest</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {formatCurrency(totalMonthlyPayment * loanTerm * 12 - loanAmount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>Total Cost</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {formatCurrency(totalMonthlyPayment * loanTerm * 12)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SimpleMortgageCalculator.propTypes = {
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
  customConfig: PropTypes.object
};

export default SimpleMortgageCalculator;
