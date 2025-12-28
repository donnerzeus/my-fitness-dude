import React from 'react';
import { ShoppingBag, UtensilsCrossed, Zap } from 'lucide-react';

const MEALS = [
    {
        type: 'Break Fast (11:30)',
        title: 'Protein Boost',
        description: '3-4 Haşlanmış Yumurta veya 150g Tavuk Füme + Bol Yeşillik + Çiğ Badem.',
        tips: 'İş yerindeysen suyundan arındırılmış sebze ve yoğurt ekle.'
    },
    {
        type: 'Pre-Workout (16:00)',
        title: 'Energy Core',
        description: '1 avuç Ceviz veya 1 ölçek Protein Tozu (Su ile).',
        tips: 'Aç değilsen bile iç, antrenman gücünü buradan alacaksın.'
    },
    {
        type: 'The Banquet (19:30)',
        title: 'Warrior Recovery',
        description: '300-400g Izgara Et/Tavuk + Buharda Brokoli/Kabak + Zeytinyağı.',
        tips: 'Çok bitiksen 4 kaşık bulgur ekle, yoksa sebzeyle devam.'
    }
];

const MealPrep: React.FC = () => {
    return (
        <div className="meal-prep">
            <div className="section-title">
                <UtensilsCrossed className="title-icon gold" />
                <h2>Warrior Nutrition</h2>
            </div>

            <div className="meal-list">
                {MEALS.map((meal, i) => (
                    <div key={i} className="meal-card glass-card">
                        <div className="meal-badge">{meal.type}</div>
                        <div className="meal-content">
                            <h4>{meal.title}</h4>
                            <p className="description">{meal.description}</p>
                            <div className="tip-box">
                                <Zap size={14} className="gold" />
                                <span>{meal.tips}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card prep-info">
                <div className="prep-header">
                    <ShoppingBag size={18} />
                    <h4>Pazar Günü "Meal Prep"</h4>
                </div>
                <p>Hafta içi ofis tuzaklarına düşmemek için 1.5kg tavuğu bugün haşla ve kaplara böl.</p>
            </div>

            <style>{`
        .meal-prep {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .meal-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .meal-card {
          position: relative;
          padding-top: 2rem !important;
        }
        .meal-badge {
          position: absolute;
          top: 0.75rem;
          left: 1rem;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary-color);
          background: rgba(212, 175, 55, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 0.5rem;
        }
        .meal-content h4 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        .description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }
        .tip-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-style: italic;
        }
        .prep-info {
          background: rgba(212, 175, 55, 0.05);
          border-color: rgba(212, 175, 55, 0.1);
        }
        .prep-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }
        .prep-info p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default MealPrep;
