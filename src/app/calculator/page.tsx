"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ROICalculator() {
  const { t } = useLanguage();

  const [price, setPrice] = useState(200000);
  const [downPayment, setDownPayment] = useState(100);
  const [monthlyRent, setMonthlyRent] = useState(800);
  const [annualAppreciation, setAnnualAppreciation] = useState(5);
  const [annualExpenses, setAnnualExpenses] = useState(2000);
  const [holdingYears, setHoldingYears] = useState(10);

  const results = useMemo(() => {
    const investment = (price * downPayment) / 100;
    const annualRent = monthlyRent * 12;
    const netAnnualIncome = annualRent - annualExpenses;
    const grossYield = (annualRent / price) * 100;
    const netYield = (netAnnualIncome / price) * 100;

    const yearlyData = [];
    let cumulativeIncome = 0;
    let currentValue = price;

    for (let year = 1; year <= holdingYears; year++) {
      currentValue = currentValue * (1 + annualAppreciation / 100);
      cumulativeIncome += netAnnualIncome;
      const totalReturn = cumulativeIncome + (currentValue - price);
      const totalROI = (totalReturn / investment) * 100;

      yearlyData.push({
        year,
        propertyValue: Math.round(currentValue),
        annualIncome: netAnnualIncome,
        cumulativeIncome: Math.round(cumulativeIncome),
        appreciation: Math.round(currentValue - price),
        totalReturn: Math.round(totalReturn),
        totalROI: totalROI.toFixed(1),
      });
    }

    return {
      investment,
      annualRent,
      netAnnualIncome,
      grossYield: grossYield.toFixed(1),
      netYield: netYield.toFixed(1),
      monthlyNetIncome: Math.round(netAnnualIncome / 12),
      yearlyData,
    };
  }, [price, downPayment, monthlyRent, annualAppreciation, annualExpenses, holdingYears]);

  const finalYear = results.yearlyData[results.yearlyData.length - 1];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("calculator.title")}</h1>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">{t("calculator.subtitle")}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 sticky top-28">
              <h2 className="text-lg font-bold text-gray-900">{t("calculator.parameters")}</h2>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>{t("calculator.propertyPrice")}</span>
                  <span className="text-primary-600 font-bold">€{price.toLocaleString()}</span>
                </label>
                <input type="range" min={30000} max={1000000} step={5000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-primary-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>€30K</span><span>€1M</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>{t("calculator.downPayment")}</span>
                  <span className="text-primary-600 font-bold">{downPayment}% (€{((price * downPayment) / 100).toLocaleString()})</span>
                </label>
                <input type="range" min={20} max={100} step={5} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full accent-primary-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>20%</span><span>100%</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>{t("calculator.monthlyRent")}</span>
                  <span className="text-primary-600 font-bold">€{monthlyRent.toLocaleString()}</span>
                </label>
                <input type="range" min={100} max={5000} step={50} value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="w-full accent-primary-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>€100</span><span>€5,000</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>{t("calculator.appreciation")}</span>
                  <span className="text-primary-600 font-bold">{annualAppreciation}%</span>
                </label>
                <input type="range" min={0} max={15} step={0.5} value={annualAppreciation} onChange={(e) => setAnnualAppreciation(Number(e.target.value))} className="w-full accent-primary-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span><span>15%</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>{t("calculator.annualExpenses")}</span>
                  <span className="text-primary-600 font-bold">€{annualExpenses.toLocaleString()}</span>
                </label>
                <input type="range" min={0} max={10000} step={200} value={annualExpenses} onChange={(e) => setAnnualExpenses(Number(e.target.value))} className="w-full accent-primary-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>€0</span><span>€10K</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>{t("calculator.holdingPeriod")}</span>
                  <span className="text-primary-600 font-bold">{holdingYears} {t("calculator.years")}</span>
                </label>
                <input type="range" min={1} max={30} step={1} value={holdingYears} onChange={(e) => setHoldingYears(Number(e.target.value))} className="w-full accent-primary-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1</span><span>30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs text-gray-500 mb-1">{t("calculator.monthlyIncome")}</p>
                <p className="text-2xl font-bold text-green-600">€{results.monthlyNetIncome.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs text-gray-500 mb-1">{t("calculator.grossYield")}</p>
                <p className="text-2xl font-bold text-blue-600">{results.grossYield}%</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs text-gray-500 mb-1">{t("calculator.netYield")}</p>
                <p className="text-2xl font-bold text-purple-600">{results.netYield}%</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs text-gray-500 mb-1">{t("calculator.totalROI")} ({holdingYears}y)</p>
                <p className="text-2xl font-bold text-accent-600">{finalYear?.totalROI}%</p>
              </div>
            </div>

            {/* Final Summary */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t("calculator.summary")} - {holdingYears} {t("calculator.years")}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t("calculator.totalInvestment")}</p>
                  <p className="text-xl font-bold text-gray-900">€{results.investment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("calculator.totalRentalIncome")}</p>
                  <p className="text-xl font-bold text-green-600">€{finalYear?.cumulativeIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("calculator.propertyAppreciation")}</p>
                  <p className="text-xl font-bold text-blue-600">€{finalYear?.appreciation.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("calculator.finalPropertyValue")}</p>
                  <p className="text-xl font-bold text-gray-900">€{finalYear?.propertyValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("calculator.totalProfit")}</p>
                  <p className="text-xl font-bold text-accent-600">€{finalYear?.totalReturn.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("calculator.totalROI")}</p>
                  <p className="text-xl font-bold text-accent-600">{finalYear?.totalROI}%</p>
                </div>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">{t("calculator.yearlyBreakdown")}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">{t("calculator.year")}</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">{t("calculator.propValue")}</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">{t("calculator.rentalIncome")}</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">{t("calculator.cumIncome")}</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">{t("calculator.totalReturn")}</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((row) => (
                      <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{row.year}</td>
                        <td className="px-4 py-3">€{row.propertyValue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-green-600">€{row.annualIncome.toLocaleString()}</td>
                        <td className="px-4 py-3">€{row.cumulativeIncome.toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium text-accent-600">€{row.totalReturn.toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold">{row.totalROI}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 leading-relaxed">
              {t("calculator.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
