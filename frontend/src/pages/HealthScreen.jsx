import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Sliders,
  Check,
  Heart,
  AlertTriangle,
  RotateCw,
  Sun,
  Fish,
  Leaf,
  Dna,
} from 'lucide-react';

/**
 * ============================================================================
 * DJANGO INTEGRATION GUIDE: HEALTH & NUTRITION PROFILE (JavaScript / JSX)
 * ============================================================================
 * In Django models:
 * 
 * class UserNutritionProfile(models.Model):
 *     user = models.OneToOneField(User, on_delete=models.CASCADE)
 *     auto_substitute_alternatives = models.BooleanField(default=True)
 *     active_framework = models.CharField(max_length=64, default="high-protein")
 *     target_calories = models.IntegerField(default=2150)
 *     target_protein_pct = models.IntegerField(default=40)
 *     target_carbs_pct = models.IntegerField(default=35)
 *     target_fats_pct = models.IntegerField(default=25)
 * 
 * class UserAllergy(models.Model):
 *     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='allergies')
 *     name = models.CharField(max_length=128)
 *     severity = models.CharField(max_length=32)
 *     description = models.TextField()
 * 
 * class UserDietaryRestriction(models.Model):
 *     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restrictions')
 *     title = models.CharField(max_length=128)
 *     description = models.TextField()
 *     enforcement = models.CharField(max_length=64)
 * ============================================================================
 */

export const HealthScreen = ({
  allergies: initialAllergies,
  restrictions: initialRestrictions,
  frameworks: initialFrameworks,
}) => {
  const [autoSubstitute, setAutoSubstitute] = useState(true);
  const [frameworks, setFrameworks] = useState(initialFrameworks);
  const [allergies, setAllergies] = useState(initialAllergies);
  const [restrictions, setRestrictions] = useState(initialRestrictions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAllergyName, setNewAllergyName] = useState('');
  const [newSeverity, setNewSeverity] = useState('HIGH');

  const activeFramework = frameworks.find((f) => f.isActive) || frameworks[0];

  const handleSelectFramework = (id) => {
    setFrameworks((prev) =>
      prev.map((f) => ({
        ...f,
        isActive: f.id === id,
      }))
    );
  };

  const handleCreateAllergy = (e) => {
    e.preventDefault();
    if (!newAllergyName.trim()) return;

    const newItem = {
      id: `allergy-${Date.now()}`,
      name: newAllergyName.trim(),
      severity: newSeverity,
      description: `User-defined active sensitivity enforced by Bri AI Auto-Shopper cart filters.`,
      badgeStyle: newSeverity === 'CRITICAL' ? 'critical' : newSeverity === 'HIGH' ? 'high' : 'preference',
    };

    setAllergies((prev) => [...prev, newItem]);
    setNewAllergyName('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-6" id="bri-health-view">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight">
          Health & Nutrition Profile
        </h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Manage your personal allergies, dietary restrictions, and macro health preferences.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Stat Metrics"
        id="health-metrics-grid"
      >
        {/* Allergen Shields */}
        <article className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Allergen Shields</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#059669] flex items-center gap-1">
              +100% Safe
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {allergies.length} Active
          </div>
          <p className="text-xs text-slate-500 font-medium">Zero cross-contamination alerts</p>
        </article>

        {/* Dietary Rules */}
        <article className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Dietary Rules</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#0284C7]">
              Strict
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {restrictions.length} Enforced
          </div>
          <p className="text-xs text-slate-500 font-medium">Auto-blocked during shopping</p>
        </article>

        {/* Macro Strategy */}
        <article className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Macro Strategy</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#0D9488]">
              40P / 35C / 25F
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1 leading-tight truncate">
            {activeFramework.name.split('/')[0]}
          </div>
          <p className="text-xs text-slate-500 font-medium">Target: 160g protein / day</p>
        </article>

        {/* Nutrient Score */}
        <article className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Nutrient Score</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#059669]">
              +8% vs last week
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">96/100</div>
          <p className="text-xs text-slate-500 font-medium">Micronutrient goals achieved</p>
        </article>
      </section>

      {/* Allergies & Intolerances Section */}
      <section
        className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        id="health-allergies-section"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-slate-900">Allergies & Intolerances</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  {allergies.length} Documented Allergies
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bri automatically cross-checks every ingredient, batch label, and recipe against these active sensitivities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-center">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-semibold text-slate-600">
                Auto-Substitute Alternatives
              </span>
              <input
                type="checkbox"
                checked={autoSubstitute}
                onChange={(e) => setAutoSubstitute(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative"></div>
            </label>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 text-sky-600 hover:bg-sky-50 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Allergy
            </button>
          </div>
        </div>

        {/* 2x2 Allergy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {allergies.map((item) => {
            let borderStyle = 'border-slate-200 bg-slate-50/60';
            let badgeBg = 'bg-slate-200 text-slate-700';
            let icon = <Sun className="w-4 h-4 text-slate-600" />;

            if (item.badgeStyle === 'critical') {
              borderStyle = 'border-rose-200/70 bg-[#FEF6F6]';
              badgeBg = 'bg-rose-600 text-white';
              icon = <AlertTriangle className="w-4 h-4 text-rose-600" />;
            } else if (item.badgeStyle === 'high') {
              borderStyle = 'border-amber-200/70 bg-[#FFFDF5]';
              badgeBg = 'bg-amber-600 text-white';
              icon = <Fish className="w-4 h-4 text-amber-600" />;
            } else if (item.badgeStyle === 'auto_swap') {
              borderStyle = 'border-emerald-200/70 bg-[#F5FBF7]';
              badgeBg = 'bg-emerald-100 text-emerald-700';
              icon = <RotateCw className="w-4 h-4 text-emerald-600" />;
            }

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border ${borderStyle} flex items-start justify-between`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center shrink-0 shadow-2xs">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ml-2 ${badgeBg}`}
                >
                  {item.severity}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dietary Restrictions Section */}
      <section
        className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        id="health-restrictions-section"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Dietary Restrictions</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {restrictions.length} Active Rules
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Religious, ethical, and ingredient-avoidance criteria enforced across all grocery carts.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Add restriction: Select from Kosher, Halal, Organic, No Artificial Preservatives, or Corn-Free.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 text-sky-600 hover:bg-sky-50 text-xs font-bold transition self-start sm:self-center cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Restriction
          </button>
        </div>

        {/* Rules List */}
        <div className="space-y-2.5">
          {restrictions.map((rule) => {
            const isBlock = rule.enforcement === 'Strict Cart Auto-Block';

            return (
              <div
                key={rule.id}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between hover:bg-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isBlock ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rule.title}</h4>
                    <p className="text-[11px] text-slate-500">{rule.description}</p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 ${
                    isBlock
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-sky-50 text-sky-600 border-sky-100'
                  }`}
                >
                  {rule.enforcement}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Preferences & Dietary Frameworks Section */}
      <section
        className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        id="dietary-framework-selector"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">
                  Health, Macro & Nutrition Preferences
                </h3>
                <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Active: {activeFramework.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Parameters that automatically optimize recipe suggestions, auto-order quantities, and portion ratios.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Customizing Health Goals: Target 160g protein, 140g clean carbs, 60g healthy fats.')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#34D399] hover:bg-[#10B981] text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            Customize Health Goals
          </button>
        </div>

        {/* Section Subtitle & Count */}
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Dietary Framework
            </h4>
            <p className="text-xs text-slate-500">
              Select a framework to auto-tune Bri's smart cart filters, recipe suggestions, and macronutrient targets.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg">
            12 Frameworks Available
          </span>
        </div>

        {/* 12 Frameworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-7">
          {frameworks.map((fw) => {
            const isActive = fw.isActive;

            return (
              <div
                key={fw.id}
                onClick={() => handleSelectFramework(fw.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                  isActive
                    ? 'border-2 border-emerald-500 bg-[#F2FDF5] shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Dna className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{fw.name}</h5>
                  </div>

                  {isActive ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white flex items-center gap-0.5">
                      ✓ Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-600"
                    >
                      Select
                    </button>
                  )}
                </div>

                <p
                  className={`text-[11px] font-medium mb-3 ${
                    isActive ? 'text-slate-600' : 'text-slate-500'
                  }`}
                >
                  {fw.description}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {fw.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white border border-emerald-200 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily Macro Allocation Bar */}
        <div className="pt-5 border-t border-slate-100" id="daily-macro-allocation">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold text-slate-800">
              Target Daily Macronutrient Distribution
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Total Caloric Estimate:{' '}
              <strong className="text-slate-800">2,150 kcal/day</strong>
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full bg-emerald-500" style={{ width: '40%' }} title="Protein 40%"></div>
            <div className="h-full bg-sky-400" style={{ width: '35%' }} title="Carbohydrates 35%"></div>
            <div className="h-full bg-amber-400" style={{ width: '25%' }} title="Healthy Fats 25%"></div>
          </div>

          {/* Legend & Values */}
          <div className="flex flex-wrap items-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">
                Protein: <strong className="text-slate-900 font-bold">40%</strong> (160g / day)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400"></span>
              <span className="text-slate-600">
                Carbohydrates: <strong className="text-slate-900 font-bold">35%</strong> (140g / day)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="text-slate-600">
                Healthy Fats: <strong className="text-slate-900 font-bold">25%</strong> (60g / day)
              </span>
            </div>
          </div>

          {/* Additional Micro & Biomarker Guardrails */}
          <div className="mt-4 pt-4 border-t border-slate-100/80 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium mr-1">Active Guardrails:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> High Fiber (&gt;35g)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Rich in Omega-3 EPA/DHA
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Low Sodium (&lt;2,000mg)
            </span>
          </div>
        </div>
      </section>

      {/* Quick Add Allergy Dialog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Add Documented Allergy</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter an ingredient sensitivity. Bri will auto-exclude it from cart recipes.
            </p>

            <form onSubmit={handleCreateAllergy} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Allergen / Ingredient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sesame, Soy, Sulfites"
                  value={newAllergyName}
                  onChange={(e) => setNewAllergyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                >
                  <option value="CRITICAL">Critical (Anaphylactic danger)</option>
                  <option value="HIGH">High (Strict exclusion)</option>
                  <option value="AUTO-SWAP">Auto-Swap (Swap to alternatives)</option>
                  <option value="PREFERENCE">Preference (Mild sensitivity)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-slate-950 shadow-sm cursor-pointer"
                >
                  Save Sensitivity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
