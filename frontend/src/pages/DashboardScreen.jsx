import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Paperclip,
  Mic,
  Send,
  Plus,
  Wheat,
  Leaf,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

/**
 * ============================================================================
 * DJANGO INTEGRATION GUIDE: DASHBOARD SCREEN (JavaScript / JSX)
 * ============================================================================
 * In a Django application, this screen is fed by two primary API endpoints:
 * 
 * 1. Metrics & Overview:
 *    GET /api/v1/dashboard/
 *    Returns the user's weekly order total, meal goals, health score, and budget.
 * 
 *    # In Django views.py:
 *    class DashboardOverviewView(APIView):
 *        permission_classes = [IsAuthenticated]
 *        def get(self, request):
 *            stats = UserDashboardStats.objects.get(user=request.user)
 *            return Response(DashboardStatsSerializer(stats).data)
 * 
 * 2. Conversational Assistant & Recommendations:
 *    POST /api/v1/assistant/chat/
 *    Payload: { "message": "Suggest high-protein snacks" }
 *    Returns updated chat message list with action cards and cart updates.
 * ============================================================================
 */

export const DashboardScreen = ({
  stats,
  chatMessages,
  onSendMessage,
  onQuickAddCart,
  onGoShopping,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [inputText, setInputText] = useState('');
  const [addedItems, setAddedItems] = useState({});

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestionClick = (prompt) => {
    onSendMessage(prompt);
  };

  const handleAddActionCard = (card) => {
    onQuickAddCart(card);
    setAddedItems((prev) => ({ ...prev, [card.id]: true }));
  };

  return (
    <div className="flex flex-col gap-6" id="bri-dashboard-view">
      {/* 4 Stats Cards Grid */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Quick Metrics"
        id="dashboard-stats-grid"
      >
        {/* Metric 1: Current Order */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(25,27,28,0.06)] border border-[#191B1C]/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(25,27,28,0.09)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#595F61]">Current Order</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0c2b14]">
              {stats.currentOrder.delta}
            </span>
          </div>
          <div className="text-[2rem] font-extrabold text-[#191B1C] tracking-tight leading-none mt-2">
            ${stats.currentOrder.amount.toFixed(2)}
          </div>
          <div className="text-xs text-[#848D90] font-medium mt-1">
            {stats.currentOrder.subtext}
          </div>
        </div>

        {/* Metric 2: Meals Planned */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(25,27,28,0.06)] border border-[#191B1C]/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(25,27,28,0.09)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#595F61]">Meals Planned</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0c2b14]">
              {stats.mealsPlanned.delta}
            </span>
          </div>
          <div className="text-[2rem] font-extrabold text-[#191B1C] tracking-tight leading-none mt-2">
            {stats.mealsPlanned.count} / {stats.mealsPlanned.target}
          </div>
          <div className="text-xs text-[#848D90] font-medium mt-1">
            {stats.mealsPlanned.subtext}
          </div>
        </div>

        {/* Metric 3: Health Score */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(25,27,28,0.06)] border border-[#191B1C]/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(25,27,28,0.09)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#595F61]">Health Score</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0c2b14]">
              {stats.healthScore.delta}
            </span>
          </div>
          <div className="text-[2rem] font-extrabold text-[#191B1C] tracking-tight leading-none mt-2">
            {stats.healthScore.score}/{stats.healthScore.total}
          </div>
          <div className="text-xs text-[#848D90] font-medium mt-1">
            {stats.healthScore.subtext}
          </div>
        </div>

        {/* Metric 4: Budget Used */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(25,27,28,0.06)] border border-[#191B1C]/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(25,27,28,0.09)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#595F61]">Budget Used</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {stats.budgetUsed.delta}
            </span>
          </div>
          <div className="text-[2rem] font-extrabold text-[#191B1C] tracking-tight leading-none mt-2">
            {stats.budgetUsed.percentage}%
          </div>
          <div className="text-xs text-[#848D90] font-medium mt-1">
            {stats.budgetUsed.subtext}
          </div>
        </div>
      </section>

      {/* Main Workspace Card */}
      <section
        className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(25,27,28,0.04)] border border-[#191B1C]/[0.04] flex flex-col overflow-hidden"
        aria-label="Active Workspace"
        id="bri-workspace-card"
      >
        {/* Workspace Tab Bar */}
        <div className="flex items-center gap-8 px-7 border-b border-[#191B1C]/[0.06] bg-[#FCFDFE]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 text-sm font-semibold relative transition cursor-pointer ${
              activeTab === 'overview'
                ? 'text-[#191B1C] font-bold'
                : 'text-[#595F61] hover:text-[#191B1C]'
            }`}
          >
            Overview & Recommendations
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#63EF46] to-[#46B8EF] rounded-t" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('cart_sync')}
            className={`py-4 text-sm font-semibold relative transition cursor-pointer ${
              activeTab === 'cart_sync'
                ? 'text-[#191B1C] font-bold'
                : 'text-[#595F61] hover:text-[#191B1C]'
            }`}
          >
            Cart Sync
            {activeTab === 'cart_sync' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#63EF46] to-[#46B8EF] rounded-t" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('macros')}
            className={`py-4 text-sm font-semibold relative transition cursor-pointer ${
              activeTab === 'macros'
                ? 'text-[#191B1C] font-bold'
                : 'text-[#595F61] hover:text-[#191B1C]'
            }`}
          >
            Macro Balancer
            {activeTab === 'macros' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#63EF46] to-[#46B8EF] rounded-t" />
            )}
          </button>
        </div>

        {/* Tab Body: Overview & Conversation Feed */}
        {activeTab === 'overview' && (
          <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[960px] w-full mx-auto">
            {/* Conversation Feed */}
            <div className="flex flex-col gap-5 overflow-y-auto max-h-[460px] pr-2">
              {chatMessages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isAssistant ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {isAssistant && (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#63EF46] to-[#46B8EF] flex items-center justify-center font-extrabold text-base text-[#0b2210] shrink-0 shadow-[0_3px_8px_rgba(70,184,239,0.25)]">
                        B
                      </div>
                    )}

                    <div
                      className={`flex flex-col gap-1.5 ${
                        isAssistant ? 'max-w-[85%]' : 'max-w-[75%] items-end'
                      }`}
                    >
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-xs font-bold text-[#191B1C]">
                          {msg.senderName}
                        </span>
                        <span className="text-[11px] text-[#848D90]">
                          {msg.timestamp}
                        </span>
                      </div>

                      <div
                        className={`rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                          isAssistant
                            ? 'bg-[#F4F8FA] border border-[#191B1C]/[0.06] text-[#191B1C] rounded-tl-sm'
                            : 'bg-gradient-to-br from-[#191B1C] to-[#2d3235] text-white shadow-[0_4px_12px_rgba(25,27,28,0.12)] rounded-tr-sm'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Embedded Action Recommendation Cards */}
                      {msg.actionCards && msg.actionCards.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5 w-full">
                          {msg.actionCards.map((card) => {
                            const isAdded = addedItems[card.id];

                            return (
                              <div
                                key={card.id}
                                className="bg-white border border-[#191B1C]/[0.08] rounded-xl p-3.5 flex flex-col gap-2.5 shadow-sm hover:shadow-md transition"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {card.categoryIcon === 'grain' ? (
                                      <Wheat className="w-4 h-4 text-amber-600" />
                                    ) : (
                                      <Leaf className="w-4 h-4 text-emerald-600" />
                                    )}
                                    <span className="font-bold text-xs text-[#191B1C]">
                                      {card.name}
                                    </span>
                                  </div>
                                  <span className="font-bold text-xs text-[#0e5275]">
                                    ${card.price.toFixed(2)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-[#595F61]">
                                  <span>🌾 {card.fiberGrams}g Fiber</span>
                                  <span>•</span>
                                  {card.proteinGrams && (
                                    <>
                                      <span>💪 {card.proteinGrams}g Protein</span>
                                      <span>•</span>
                                    </>
                                  )}
                                  {card.customTag && (
                                    <>
                                      <span>{card.customTag}</span>
                                      <span>•</span>
                                    </>
                                  )}
                                  <span>🔥 {card.calories} kcal</span>
                                </div>

                                <button
                                  onClick={() => handleAddActionCard(card)}
                                  disabled={isAdded}
                                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                    isAdded
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0b2210] hover:brightness-105 shadow-sm'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                                      <span>Added to Auto-Cart</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Quick Add</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {!isAssistant && (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#191B1C] to-[#3a3f42] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        JD
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Suggestions & Persistent Chat Input */}
            <div className="pt-3 border-t border-[#191B1C]/[0.05] flex flex-col gap-3">
              {/* Suggestion Prompt Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleSuggestionClick('Suggest high-protein snacks')}
                  className="bg-white border border-[#46B8EF]/40 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0f628c] hover:bg-sky-50 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  Suggest high-protein snacks
                </button>

                <button
                  type="button"
                  onClick={() => handleSuggestionClick('Review upcoming auto-order')}
                  className="bg-white border border-[#63EF46]/50 rounded-full px-3 py-1.5 text-xs font-semibold text-[#17681c] hover:bg-emerald-50 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  Review upcoming auto-order
                </button>

                <button
                  type="button"
                  onClick={() => handleSuggestionClick('Swap out dairy for oat alternatives')}
                  className="bg-white border border-[#191B1C]/10 rounded-full px-3 py-1.5 text-xs font-semibold text-[#595F61] hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  Swap out dairy for oat alternatives
                </button>
              </div>

              {/* Pinned Input Bar */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 bg-white border border-[#191B1C]/[0.12] rounded-full px-3 py-1.5 shadow-[0_4px_16px_rgba(25,27,28,0.06)]"
              >
                <button
                  type="button"
                  className="p-1.5 text-[#848D90] hover:text-[#191B1C] rounded-full transition cursor-pointer"
                  title="Attach file or receipt"
                  onClick={() => alert('Attach file: Upload grocery receipts or custom meal recipes for Bri to analyze!')}
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Message Bri Assistant or ask about recipes, cart, macros..."
                  className="flex-1 bg-transparent text-sm text-[#191B1C] placeholder-[#848D90] outline-none border-none py-1"
                />

                <button
                  type="button"
                  className="p-1.5 text-[#848D90] hover:text-[#191B1C] rounded-full transition cursor-pointer"
                  title="Voice input"
                  onClick={() => alert('Voice search activated: Listening for meal preferences...')}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0b2210] flex items-center justify-center shadow-[0_2px_8px_rgba(70,184,239,0.35)] shrink-0 transition disabled:opacity-40 cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab Body: Cart Sync */}
        {activeTab === 'cart_sync' && (
          <div className="p-7 max-w-[800px] mx-auto flex flex-col gap-4">
            <div className="bg-[#eefcf4] border border-[#c3f2d6] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Kroger Direct Auto-Sync Active</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Synchronizing aisle inventory, digital coupons, and in-stock guarantees for active items.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Bri auto-evaluates sales prices every 4 hours. You currently have $5.40 in unapplied digital manufacturer coupons.
            </p>
          </div>
        )}

        {/* Tab Body: Macro Balancer */}
        {activeTab === 'macros' && (
          <div className="p-7 max-w-[800px] mx-auto flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Weekly Macro Target Alignment</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  96% Target Match
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Protein (Goal: 160g/day)</span>
                  <span className="text-emerald-600">162g avg (101%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>

                <div className="flex justify-between font-semibold pt-2">
                  <span>Healthy Fats (Goal: 60g/day)</span>
                  <span className="text-emerald-600">58g avg (97%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '97%' }}></div>
                </div>

                <div className="flex justify-between font-semibold pt-2">
                  <span>Fiber (Goal: 35g/day)</span>
                  <span className="text-sky-600">38g avg (108%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Prominent Full-Width "Go Shopping" Button */}
      <div className="w-full pt-1 pb-4">
        <button
          onClick={onGoShopping}
          id="go-shopping-btn"
          className="w-full bg-gradient-to-r from-[#63EF46] to-[#46B8EF] text-[#0b2210] font-bold text-base py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(70,184,239,0.35)] hover:shadow-[0_6px_18px_rgba(70,184,239,0.45)] hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Go Shopping</span>
        </button>
      </div>
    </div>
  );
};
