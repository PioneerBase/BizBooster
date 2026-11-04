import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Building, 
  Users, 
  HelpCircle, 
  Info, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  Percent,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { BusinessProfile } from '../types/compliance';

interface TaxCalculatorViewProps {
  profile: BusinessProfile;
  onOpenPdfPage: (page: number) => void;
  onSelectPortalKey: (key: string) => void;
}

export const TaxCalculatorView: React.FC<TaxCalculatorViewProps> = ({
  profile,
  onOpenPdfPage,
  onSelectPortalKey,
}) => {
  // Calculator tab
  const [activeCalc, setActiveCalc] = useState<'trader' | 'famli' | 'sales_tax' | 'sdat'>('trader');

  // Trader's License Calculator State
  const [inventoryValue, setInventoryValue] = useState<number>(profile.inventoryValuation || 25000);
  const [isBaltimoreCity, setIsBaltimoreCity] = useState<boolean>(profile.countyOrCity === 'Baltimore City');
  const [isServiceOnly, setIsServiceOnly] = useState<boolean>(!profile.hasRetailInventory);

  // FAMLI Calculator State
  const [employeeCount, setEmployeeCount] = useState<number>(profile.employeeCount || 8);
  const [quarterlyPayroll, setQuarterlyPayroll] = useState<number>(profile.estimatedQuarterlyWages || 75000);

  // Sales Tax Calculator State
  const [grossSales, setGrossSales] = useState<number>(10000);
  const [alcoholSales, setAlcoholSales] = useState<number>(0);

  // Standard Maryland County Trader's License schedule (excluding Baltimore City)
  const calculateCountyTraderFee = (val: number): number => {
    if (val <= 1000) return 15;
    if (val <= 2500) return 18;
    if (val <= 5000) return 20;
    if (val <= 10000) return 25;
    if (val <= 15000) return 30;
    if (val <= 20000) return 40;
    if (val <= 30000) return 50;
    if (val <= 40000) return 65;
    if (val <= 50000) return 80;
    if (val <= 75000) return 100;
    if (val <= 100000) return 125;
    if (val <= 150000) return 150;
    if (val <= 200000) return 200;
    if (val <= 300000) return 300;
    if (val <= 400000) return 400;
    if (val <= 500000) return 500;
    if (val <= 750000) return 600;
    return 800;
  };

  // Baltimore City Trader's License schedule
  const calculateBaltimoreCityFee = (val: number): number => {
    if (val <= 1000) return 20;
    if (val <= 2500) return 25;
    if (val <= 5000) return 30;
    if (val <= 10000) return 40;
    if (val <= 20000) return 55;
    if (val <= 50000) return 110;
    if (val <= 100000) return 160;
    if (val <= 200000) return 260;
    if (val <= 300000) return 380;
    if (val <= 500000) return 650;
    if (val <= 750000) return 800;
    return 1000;
  };

  // Trader's fee calculation
  const rawBaseTraderFee = isBaltimoreCity
    ? calculateBaltimoreCityFee(inventoryValue)
    : calculateCountyTraderFee(inventoryValue);
  const clerkIssuingFee = 2; // Maryland Courts statutory $2 Clerk issuing fee
  const totalTraderLicenseFee = isServiceOnly ? 0 : rawBaseTraderFee + clerkIssuingFee;

  // FAMLI calculations (2027 State Plan)
  // Total rate: 0.9% of covered wages
  // If >= 15 employees: Employer 0.45%, Employee 0.45%
  // If < 15 employees: Employer 0%, Employee 0.45% (remit only employee share)
  const isLargeEmployer = employeeCount >= 15;
  const famliTotalQuarterly = Math.round(quarterlyPayroll * 0.009 * 100) / 100;
  const famliEmployeeQuarterly = Math.round(quarterlyPayroll * 0.0045 * 100) / 100;
  const famliEmployerQuarterly = isLargeEmployer ? famliEmployeeQuarterly : 0;
  const famliAnnualSavings = !isLargeEmployer ? famliEmployeeQuarterly * 4 : 0;

  // Sales Tax calculations
  const standardSalesTax = Math.round(grossSales * 0.06 * 100) / 100;
  const alcoholSalesTax = Math.round(alcoholSales * 0.09 * 100) / 100;
  const totalSalesTax = standardSalesTax + alcoholSalesTax;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Maryland Local Tax & Regulatory Metrics</span>
            <span aria-hidden="true">·</span>
            <span>Accurate Statutory Tables</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Compliance Fee & Contribution Estimators
          </h1>
          <p className="text-sm text-slate-600">
            Model statutory Clerk Trader’s license fees by wholesale inventory valuation, calculate upcoming 2027 FAMLI employer contributions, and estimate sales tax remittance obligations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'trader', label: 'Trader’s License Fee' },
            { id: 'famli', label: '2027 FAMLI Contribution' },
            { id: 'sales_tax', label: 'Sales & Use Tax' },
            { id: 'sdat', label: 'SDAT Annual Standing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCalc(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeCalc === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CALCULATOR 1: TRADER'S LICENSE */}
      {activeCalc === 'trader' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Circuit Court Trader’s License Estimator
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Maryland law requires businesses selling goods at retail to hold a Trader’s License issued by the local Circuit Court Clerk. The license year runs <strong>May 1 through April 30</strong>. Fees are based on the wholesale value of your retail inventory.
              </p>
            </div>

            {/* Service-only toggle */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
              <input
                type="checkbox"
                id="service-only-toggle"
                checked={isServiceOnly}
                onChange={(e) => setIsServiceOnly(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="service-only-toggle" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-semibold text-slate-900">Service-Only Business Checkpoint:</span> This business offers services only and maintains zero retail stock. (Maryland law does NOT require a Trader’s license merely because you are an active business).
              </label>
            </div>

            {!isServiceOnly && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Wholesale Value of Retail Inventory:
                    </label>
                    <span className="text-sm font-mono font-bold text-slate-900">
                      ${inventoryValue.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="800000"
                    step="1000"
                    value={inventoryValue}
                    onChange={(e) => setInventoryValue(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                    <span>$500</span>
                    <span>$100,000</span>
                    <span>$300,000</span>
                    <span>$800,000+</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Direct Dollar Input ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="0"
                        value={inventoryValue}
                        onChange={(e) => setInventoryValue(Math.max(0, Number(e.target.value)))}
                        className="w-full text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Operating Jurisdiction
                    </label>
                    <select
                      value={isBaltimoreCity ? 'city' : 'county'}
                      onChange={(e) => setIsBaltimoreCity(e.target.value === 'city')}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white font-medium"
                    >
                      <option value="county">Maryland Standard County (23 Counties)</option>
                      <option value="city">Baltimore City (Special Schedule)</option>
                    </select>
                  </div>
                </div>

                {/* Baltimore City notice */}
                {isBaltimoreCity && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Baltimore City Distinction:</strong> The published statewide county fee table expressly excludes Baltimore City. The City employs an independent statutory fee tier as calculated here.
                    </span>
                  </div>
                )}

                {/* SDAT & Personal property prerequisite warning */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Issuance Pre-Condition:</strong> Comptroller regulations stipulate that a Trader’s License cannot be issued if local personal property taxes are delinquent or if SDAT annual corporate reports are not in good standing.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fee Calculation Summary Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Annual Cost Estimate
              </span>

              {isServiceOnly ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-1">
                  <div className="text-2xl font-bold font-mono text-emerald-800">$0.00</div>
                  <div className="text-xs font-semibold text-emerald-900">Exempt (Service-Only)</div>
                  <p className="text-[11px] text-emerald-700">
                    No retail inventory carried; Trader’s license not statutory required.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                    <span>Base Trader’s License Fee:</span>
                    <span className="font-mono font-bold text-slate-900">${rawBaseTraderFee.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                    <span>Circuit Clerk Issuing Fee:</span>
                    <span className="font-mono font-bold text-slate-900">${clerkIssuingFee.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="font-bold text-slate-900">Total License Cost:</span>
                    <span className="font-mono font-bold text-lg text-slate-900">${totalTraderLicenseFee.toFixed(2)}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1">
                    Valid May 1, 2026 – April 30, 2027. Renewal notice mailed annually in March.
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
              <button
                onClick={() => onSelectPortalKey('S5')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-medium text-slate-700 cursor-pointer"
              >
                <span>Comptroller Trader’s Guide [S5]</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenPdfPage(3)}
                className="w-full text-center text-slate-500 hover:text-slate-800 underline cursor-pointer py-1"
              >
                View Details in Guide (Page 3)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 2: FAMLI 2027 CONTRIBUTIONS */}
      {activeCalc === 'famli' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Maryland FAMLI 2027 Contribution Estimator
                </h2>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  Starts Jan 1, 2027
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Family and Medical Leave Insurance (FAMLI) applies to all employers with at least 1 Maryland employee. Total statutory rate is <strong>0.9%</strong> of covered wages up to the Social Security wage cap.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Employee Count (Inside & Outside MD under same EIN)
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Threshold: <strong>15 employees</strong> triggers employer cost-sharing.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Quarterly Maryland Gross Payroll ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={quarterlyPayroll}
                    onChange={(e) => setQuarterlyPayroll(Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Capped at the federal Social Security annual wage maximum.
                </p>
              </div>
            </div>

            {/* Small Employer Privilege Notice */}
            {!isLargeEmployer ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Small Employer Relief Active (&lt; 15 Employees)</span>
                </div>
                <p className="text-emerald-800">
                  Because you employ fewer than 15 workers, you are <strong>exempt from paying the 0.45% employer share</strong>. You remit only the 0.45% employee payroll withholding.
                </p>
                <p className="text-[11px] text-emerald-700">
                  * Note: Small employers must STILL register with the State Plan and submit quarterly wage/hour reports.
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Building className="w-4 h-4 text-slate-700" />
                  <span>Standard Employer Sharing (15+ Employees)</span>
                </div>
                <p className="text-slate-700">
                  As an employer with 15 or more employees under the same EIN, you must fund <strong>0.45%</strong> as an employer contribution and withhold up to <strong>0.45%</strong> from employee wages.
                </p>
              </div>
            )}
          </div>

          {/* FAMLI Breakdown Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Quarterly FAMLI Cost
              </span>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                  <span>Employer Outlay (0% / 0.45%):</span>
                  <span className="font-mono font-bold text-slate-900">${famliEmployerQuarterly.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                  <span>Employee Withholding (0.45%):</span>
                  <span className="font-mono font-bold text-slate-900">${famliEmployeeQuarterly.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm pt-1">
                  <span className="font-bold text-slate-900">Total Remitted to State:</span>
                  <span className="font-mono font-bold text-lg text-slate-900">${famliTotalQuarterly.toFixed(2)}</span>
                </div>

                {!isLargeEmployer && (
                  <div className="mt-2 p-2 bg-emerald-100/70 rounded text-[11px] text-emerald-900 font-medium">
                    Estimated Annual Employer Savings: <strong>${famliAnnualSavings.toFixed(2)}</strong>/year
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
              <button
                onClick={() => onSelectPortalKey('S9')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-medium text-slate-700 cursor-pointer"
              >
                <span>FAMLI Rates & Schedules [S9]</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenPdfPage(6)}
                className="w-full text-center text-slate-500 hover:text-slate-800 underline cursor-pointer py-1"
              >
                View Rules in Guide (Page 6)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 3: SALES & USE TAX */}
      {activeCalc === 'sales_tax' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Maryland Sales & Use Tax Calculator
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Maryland levies a <strong>6.0%</strong> standard sales and use tax on tangible personal property and taxable digital products, and a specialized <strong>9.0%</strong> rate on alcoholic beverages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  General Taxable Goods & Services Sales ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={grossSales}
                    onChange={(e) => setGrossSales(Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Standard state tax rate: 6.0%</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alcoholic Beverage Sales ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={alcoholSales}
                    onChange={(e) => setAlcoholSales(Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Alcoholic beverage statutory rate: 9.0%</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
              <span className="font-semibold text-slate-900">Maryland Comptroller Remittance Cadence:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li><strong>Monthly filing:</strong> Required if expected tax liability exceeds $700/month (due the 20th).</li>
                <li><strong>Quarterly filing:</strong> If tax liability is between $250 and $700/month.</li>
                <li><strong>Semi-annual or Annual:</strong> Permitted for low-volume or seasonal vendors by approval.</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Sales Tax Summary
              </span>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                  <span>General Sales Tax (6%):</span>
                  <span className="font-mono font-bold text-slate-900">${standardSalesTax.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                  <span>Alcohol Sales Tax (9%):</span>
                  <span className="font-mono font-bold text-slate-900">${alcoholSalesTax.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm pt-1">
                  <span className="font-bold text-slate-900">Total Tax Collected:</span>
                  <span className="font-mono font-bold text-lg text-slate-900">${totalSalesTax.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
              <button
                onClick={() => onSelectPortalKey('S2')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-medium text-slate-700 cursor-pointer"
              >
                <span>Maryland Tax Connect (CRA) [S2]</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 4: SDAT ANNUAL STANDING */}
      {activeCalc === 'sdat' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              SDAT Good Standing & Annual Filing Schedule
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              To preserve legal existence and liability shielding, every Maryland entity must file an Annual Report and/or Personal Property Tax Return with the State Department of Assessments and Taxation (SDAT).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase">First Due Date</span>
              <div className="text-xl font-bold font-mono text-slate-900">April 15, 2027</div>
              <p className="text-xs text-slate-600">
                A business formed in 2026 must file its first Annual Report by April 15, 2027, <strong>even with zero revenue or operations</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Standard Filing Fee</span>
              <div className="text-xl font-bold font-mono text-slate-900">$300.00 / year</div>
              <p className="text-xs text-slate-600">
                Standard state filing fee for Maryland LLCs, Corporations, LPs, and LLPs ($0 for non-profits).
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Personal Property Tax</span>
              <div className="text-xl font-bold font-mono text-slate-900">County Assessed</div>
              <p className="text-xs text-slate-600">
                SDAT certifies values to local counties. Failure to pay prevents Circuit Court Clerks from issuing licenses.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              onClick={() => onSelectPortalKey('S13')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg cursor-pointer"
            >
              <span>SDAT Good Standing & Filing Portal [S13]</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenPdfPage(7)}
              className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Guide Page 7: Good Standing Rules
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
