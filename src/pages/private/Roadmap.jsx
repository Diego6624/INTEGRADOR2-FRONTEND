import { useState, useCallback } from 'react';
import svgPaths from '@/pages/private/svg-gpgojdiaa6';
// ─── Map Canvas Data ──────────────────────────────────────────────────────────

const CW = 900;
const CH = 820;

const MAP_NODES = [
  { id: 'root', label: 'Full-Stack · React y Node.js', cx: 450, cy: 56, w: 310, h: 52, type: 'root' },
  { id: 'fase1', label: 'Fase 1: Frontend', cx: 450, cy: 158, w: 200, h: 44, type: 'phase' },
  { id: 'htmlcss', label: 'HTML & CSS\nFundamentos', cx: 175, cy: 274, w: 168, h: 44, type: 'topic' },
  { id: 'javascript', label: 'JavaScript ES2024', cx: 450, cy: 276, w: 172, h: 40, type: 'topic' },
  { id: 'react19', label: 'React 19 y Hooks', cx: 726, cy: 276, w: 164, h: 40, type: 'topic' },
  { id: 'fase2', label: 'Fase 2: Backend', cx: 450, cy: 386, w: 200, h: 44, type: 'phase' },
  { id: 'nodejs', label: 'Node.js y Express', cx: 232, cy: 504, w: 170, h: 40, type: 'topic' },
  { id: 'databases', label: 'Bases de Datos\n(PostgreSQL)', cx: 450, cy: 504, w: 180, h: 44, type: 'topic' },
  { id: 'apis', label: 'APIs RESTful\ny GraphQL', cx: 668, cy: 504, w: 164, h: 44, type: 'topic' },
  { id: 'fase3', label: 'Fase 3: Deploy', cx: 450, cy: 616, w: 200, h: 44, type: 'phase' },
  { id: 'devops', label: 'Deploy y DevOps básico', cx: 310, cy: 730, w: 196, h: 40, type: 'topic' },
  { id: 'portfolio', label: 'Proyecto final\nde portfolio', cx: 592, cy: 730, w: 180, h: 44, type: 'topic' },
];

const NODE_BY_ID = new Map(MAP_NODES.map(n => [n.id, n]));

const EDGES = [
  ['root', 'fase1'],
  ['fase1', 'htmlcss'],
  ['fase1', 'javascript'],
  ['fase1', 'react19'],
  ['fase1', 'fase2'],
  ['fase2', 'nodejs'],
  ['fase2', 'databases'],
  ['fase2', 'apis'],
  ['fase2', 'fase3'],
  ['fase3', 'devops'],
  ['fase3', 'portfolio'],
];

const LIST_ITEMS = [
  { id: 'htmlcss', label: 'HTML & CSS Fundamentos' },
  { id: 'javascript', label: 'JavaScript ES2024' },
  { id: 'react19', label: 'React 19 y Hooks' },
  { id: 'nodejs', label: 'Node.js y Express' },
  { id: 'databases', label: 'Bases de Datos (PostgreSQL)' },
  { id: 'apis', label: 'APIs RESTful y GraphQL' },
  { id: 'devops', label: 'Deploy y DevOps básico' },
  { id: 'portfolio', label: 'Proyecto final de portfolio' },
];

const INIT_STATUSES = {
  htmlcss: 'done', javascript: 'done', react19: 'done',
  nodejs: 'none', databases: 'none', apis: 'none',
  devops: 'none', portfolio: 'none',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bezier(a, b) {
  const x1 = a.cx, y1 = a.cy + a.h / 2;
  const x2 = b.cx, y2 = b.cy - b.h / 2;
  const m = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${m}, ${x2} ${m}, ${x2} ${y2}`;
}

function edgeColor(from, to, s) {
  if (from.type === 'root') return '#3e54a0';
  if (from.type === 'phase' && to.type === 'phase') return '#2a3a6a';
  if (s === 'done') return '#00e5b8';
  if (s === 'learning') return '#5b74d8';
  if (s === 'skip') return '#2a3050';
  return '#1e2d4a';
}

function edgeOpacity(from, to, s) {
  if (from.type === 'root') return 0.8;
  if (from.type === 'phase' && to.type === 'phase') return 0.6;
  return s === 'none' ? 0.4 : 0.9;
}

function edgeDash(from, to) {
  return from.type === 'phase' && to.type === 'phase' ? '5 3' : '';
}

function topicColors(s) {
  if (s === 'learning') return { bg: 'rgba(62,84,160,0.22)', border: '#5b74d8', text: '#a0b4ff', glow: '0 0 14px rgba(91,116,216,0.45)' };
  if (s === 'done') return { bg: 'rgba(0,229,184,0.09)', border: '#00e5b8', text: '#00e5b8', glow: '0 0 14px rgba(0,229,184,0.35)' };
  if (s === 'skip') return { bg: '#080e1c', border: '#1e2540', text: '#323e60', glow: '' };
  return { bg: '#1a2540', border: '#1e2d4a', text: '#cdd4f0', glow: '' };
}

function completionPct(statuses) {
  const done = LIST_ITEMS.filter(i => statuses[i.id] === 'done').length;
  return Math.round((done / LIST_ITEMS.length) * 100);
}

// ─── Status Popup ─────────────────────────────────────────────────────────────

function StatusPopup({ status, cx, cy, onSelect, onClose }) {
  const btnBase = {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '8px 13px', fontSize: 11,
    fontFamily: "'Outfit:Medium', Outfit, sans-serif",
    fontWeight: 500, border: 'none', cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s', whiteSpace: 'nowrap',
    letterSpacing: '0.02em',
  };

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy - 52,
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Popup card */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#07101f',
          border: '1px solid #1e2d4a',
          borderRadius: 10,
          boxShadow: '0 12px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,116,216,0.1)',
          overflow: 'hidden',
        }}>
          <button
            style={{
              ...btnBase,
              color: status === 'learning' ? '#8aabff' : '#7b8ab0',
              background: status === 'learning' ? 'rgba(91,116,216,0.18)' : 'transparent',
            }}
            onClick={() => onSelect('learning')}
            onMouseEnter={e => { if (status !== 'learning') e.currentTarget.style.background = 'rgba(91,116,216,0.08)'; }}
            onMouseLeave={e => { if (status !== 'learning') e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: 13 }}>📖</span> Learning
          </button>

          <div style={{ width: 1, height: 30, background: '#1e2d4a', flexShrink: 0 }} />

          <button
            style={{
              ...btnBase,
              color: status === 'done' ? '#00e5b8' : '#7b8ab0',
              background: status === 'done' ? 'rgba(0,229,184,0.09)' : 'transparent',
            }}
            onClick={() => onSelect('done')}
            onMouseEnter={e => { if (status !== 'done') e.currentTarget.style.background = 'rgba(0,229,184,0.07)'; }}
            onMouseLeave={e => { if (status !== 'done') e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ color: '#00e5b8', fontWeight: 700 }}>✓</span> Done
          </button>

          <div style={{ width: 1, height: 30, background: '#1e2d4a', flexShrink: 0 }} />

          <button
            style={{
              ...btnBase,
              color: status === 'skip' ? '#4a5580' : '#7b8ab0',
              background: status === 'skip' ? 'rgba(40,50,100,0.15)' : 'transparent',
            }}
            onClick={() => onSelect('skip')}
            onMouseEnter={e => { if (status !== 'skip') e.currentTarget.style.background = 'rgba(40,50,100,0.08)'; }}
            onMouseLeave={e => { if (status !== 'skip') e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: 14 }}>×</span> Skip
          </button>
        </div>

        {/* Arrow pointing down toward node */}
        <div style={{
          position: 'absolute',
          bottom: -6, left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #1e2d4a',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -4, left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid #07101f',
        }} />
      </div>
    </>
  );
}

// ─── Map Status Badge ──────────────────────────────────────────────────────────

function StatusIcon({ s }) {
  if (s === 'done') return <span style={{ color: '#00e5b8', fontSize: 10, fontWeight: 700 }}>✓</span>;
  if (s === 'learning') return <span style={{ fontSize: 10 }}>📖</span>;
  if (s === 'skip') return <span style={{ color: '#3a4568', fontSize: 11, lineHeight: 1 }}>×</span>;
  return null;
}

// ─── Roadmap Map View ─────────────────────────────────────────────────────────

function RoadmapMapView({ statuses, onStatusChange }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleNodeClick = useCallback((node) => {
    if (node.type !== 'topic') return;
    setSelectedId(prev => prev === node.id ? null : node.id);
  }, []);

  const handleSelect = useCallback((s) => {
    if (!selectedId) return;
    onStatusChange(selectedId, s);
    setSelectedId(null);
  }, [selectedId, onStatusChange]);

  return (
    <div
      style={{
        overflowX: 'auto', overflowY: 'auto',
        width: '100%', maxHeight: 540,
        position: 'relative',
      }}
      onClick={() => setSelectedId(null)}
    >
      {/* Legend */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '8px 12px 12px',
        fontFamily: "'Outfit:Regular', Outfit, sans-serif",
        fontSize: 11, color: '#7b8ab0',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: '#1a2540', border: '1.5px solid #1e2d4a', display: 'inline-block' }} />
          Sin iniciar
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(62,84,160,0.22)', border: '1.5px solid #5b74d8', display: 'inline-block' }} />
          Learning
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(0,229,184,0.09)', border: '1.5px solid #00e5b8', display: 'inline-block' }} />
          Done
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: '#080e1c', border: '1.5px solid #1e2540', display: 'inline-block' }} />
          Skip
        </span>
        <span style={{ marginLeft: 'auto', color: '#4a5580' }}>Haz clic en un nodo para cambiar su estado</span>
      </div>

      {/* Canvas */}
      <div
        style={{
          position: 'relative',
          width: CW, height: CH,
          minWidth: CW,
          flexShrink: 0,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* SVG connections */}
        <svg
          style={{ position: 'absolute', inset: 0, width: CW, height: CH, overflow: 'visible', pointerEvents: 'none' }}
          viewBox={`0 0 ${CW} ${CH}`}
        >
          <defs>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {EDGES.map(([fromId, toId]) => {
            const from = NODE_BY_ID.get(fromId);
            const to = NODE_BY_ID.get(toId);
            const s = to.type === 'topic' ? statuses[toId] : 'none';
            const color = edgeColor(from, to, s);
            const opacity = edgeOpacity(from, to, s);
            const dash = edgeDash(from, to);
            return (
              <path
                key={`${fromId}-${toId}`}
                d={bezier(from, to)}
                stroke={color}
                strokeWidth={s !== 'none' && to.type === 'topic' ? 1.8 : 1.2}
                strokeDasharray={dash}
                opacity={opacity}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {MAP_NODES.map(node => {
          const s = node.type === 'topic' ? statuses[node.id] : 'none';
          const cols = topicColors(s);
          const isSelected = selectedId === node.id;

          if (node.type === 'root') {
            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.cx - node.w / 2,
                  top: node.cy - node.h / 2,
                  width: node.w, height: node.h,
                  background: 'linear-gradient(135deg, #2d3f7a 0%, #1a2560 100%)',
                  border: '2px solid #5b74d8',
                  borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(91,116,216,0.4), 0 4px 16px rgba(0,0,0,0.5)',
                  userSelect: 'none',
                }}
              >
                <span style={{
                  fontFamily: "'Outfit:SemiBold', Outfit, sans-serif",
                  fontWeight: 600, fontSize: 13,
                  color: '#dde6ff', letterSpacing: '0.02em',
                  textAlign: 'center', lineHeight: 1.4,
                }}>
                  {node.label}
                </span>
              </div>
            );
          }

          if (node.type === 'phase') {
            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.cx - node.w / 2,
                  top: node.cy - node.h / 2,
                  width: node.w, height: node.h,
                  background: 'rgba(10,18,42,0.95)',
                  border: '1.5px solid',
                  borderImage: 'linear-gradient(135deg, #7c6dff, #00e5b8) 1',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(124,109,255,0.2), 0 4px 12px rgba(0,0,0,0.4)',
                  userSelect: 'none',
                  overflow: 'visible',
                }}
              >
                {/* Gradient border trick */}
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 10,
                  padding: 1.5,
                  background: 'linear-gradient(135deg, #7c6dff, #00e5b8)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }} />
                <span style={{
                  fontFamily: "'Outfit:SemiBold', Outfit, sans-serif",
                  fontWeight: 600, fontSize: 12,
                  color: '#c8d6ff', letterSpacing: '0.03em',
                }}>
                  {node.label}
                </span>
              </div>
            );
          }

          // Topic node
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: node.cx - node.w / 2,
                top: node.cy - node.h / 2,
                width: node.w, height: node.h,
                background: cols.bg,
                border: `1.5px solid ${isSelected ? '#8aabff' : cols.border}`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
                boxShadow: isSelected
                  ? '0 0 0 2px rgba(138,171,255,0.3), 0 0 16px rgba(91,116,216,0.5)'
                  : cols.glow || 'none',
                userSelect: 'none',
                gap: 5,
                padding: '0 10px',
              }}
              onClick={e => { e.stopPropagation(); handleNodeClick(node); }}
            >
              <span style={{
                fontFamily: "'Outfit:Regular', Outfit, sans-serif",
                fontWeight: s === 'skip' ? 400 : 400,
                fontSize: 11,
                color: cols.text,
                textAlign: 'center',
                lineHeight: 1.45,
                textDecoration: s === 'skip' ? 'line-through' : 'none',
                opacity: s === 'skip' ? 0.5 : 1,
                flex: 1,
              }}>
                {node.label.split('\n').map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </span>
              <span style={{ flexShrink: 0 }}>
                <StatusIcon s={s} />
              </span>
            </div>
          );
        })}

        {/* Status popup */}
        {selectedId && (() => {
          const node = NODE_BY_ID.get(selectedId);
          return (
            <StatusPopup
              key={selectedId}
              status={statuses[selectedId]}
              cx={node.cx}
              cy={node.cy - node.h / 2}
              onSelect={handleSelect}
              onClose={() => setSelectedId(null)}
            />
          );
        })()}
      </div>
    </div>
  );
}

// ─── Roadmap List View ────────────────────────────────────────────────────────

function RoadmapListView({ statuses, onStatusChange }) {
  return (
    <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {LIST_ITEMS.map((item, i) => {
        const s = statuses[item.id];
        const isDone = s === 'done';
        const isSkip = s === 'skip';
        const isLearning = s === 'learning';

        const itemBg = isDone
          ? 'rgba(0,229,184,0.06)'
          : isLearning
            ? 'rgba(62,84,160,0.15)'
            : isSkip
              ? '#080e1c'
              : '#1a2540';

        const itemBorder = isDone
          ? 'rgba(0,229,184,0.25)'
          : isLearning
            ? '#3e54a0'
            : isSkip
              ? '#1a2030'
              : '#1e2d4a';

        return (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: itemBg,
              border: `1px solid ${itemBorder}`,
              borderRadius: 12,
              padding: '9px 14px',
              transition: 'all 0.2s',
            }}
          >
            {/* Status dot */}
            <div style={{
              width: 20, height: 20,
              borderRadius: '50%',
              border: `2px solid ${isDone ? '#00e5b8' : isLearning ? '#5b74d8' : isSkip ? '#2a3050' : '#1e2d4a'}`,
              background: isDone ? 'rgba(0,229,184,0.12)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {isDone && <span style={{ color: '#00e5b8', fontSize: 9, fontWeight: 700 }}>✓</span>}
              {isLearning && <span style={{ color: '#5b74d8', fontSize: 9 }}>●</span>}
            </div>

            {/* Label */}
            <span style={{
              flex: 1,
              fontFamily: "'Outfit:Regular', Outfit, sans-serif",
              fontWeight: 400, fontSize: 14,
              color: isDone ? '#b8b5d0' : isSkip ? '#3a4568' : '#eee9ff',
              textDecoration: (isDone || isSkip) ? 'line-through' : 'none',
              opacity: isSkip ? 0.6 : 1,
            }}>
              {item.label}
            </span>

            {/* Status buttons */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 2,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid #1e2d4a',
              borderRadius: 8,
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <button
                style={{
                  padding: '4px 10px',
                  fontSize: 10, fontWeight: 500,
                  fontFamily: "'Outfit:Medium', Outfit, sans-serif",
                  border: 'none', cursor: 'pointer',
                  color: isLearning ? '#8aabff' : '#7b8ab0',
                  background: isLearning ? 'rgba(91,116,216,0.2)' : 'transparent',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}
                onClick={() => onStatusChange(item.id, isLearning ? 'none' : 'learning')}
                title="Marcar como Learning"
              >
                📖
              </button>
              <div style={{ width: 1, height: 18, background: '#1e2d4a' }} />
              <button
                style={{
                  padding: '4px 10px',
                  fontSize: 10, fontWeight: 500,
                  fontFamily: "'Outfit:Medium', Outfit, sans-serif",
                  border: 'none', cursor: 'pointer',
                  color: isDone ? '#00e5b8' : '#7b8ab0',
                  background: isDone ? 'rgba(0,229,184,0.1)' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onClick={() => onStatusChange(item.id, isDone ? 'none' : 'done')}
                title="Marcar como Done"
              >
                ✓
              </button>
              <div style={{ width: 1, height: 18, background: '#1e2d4a' }} />
              <button
                style={{
                  padding: '4px 10px',
                  fontSize: 11, fontWeight: 500,
                  fontFamily: "'Outfit:Medium', Outfit, sans-serif",
                  border: 'none', cursor: 'pointer',
                  color: isSkip ? '#4a5580' : '#7b8ab0',
                  background: isSkip ? 'rgba(40,50,100,0.2)' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onClick={() => onStatusChange(item.id, isSkip ? 'none' : 'skip')}
                title="Marcar como Skip"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Roadmap Card (Full-Stack) ────────────────────────────────────────────────

function FullStackCard({ statuses, onStatusChange }) {
  const [viewMode, setViewMode] = useState('list');
  const pct = completionPct(statuses);
  const doneCount = LIST_ITEMS.filter(i => statuses[i.id] === 'done').length;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.54)',
      border: '1px solid #1e2d4a',
      borderRadius: 16, overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'start',
        gap: 16, padding: '20px 20px 0',
      }}>
        {/* Icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(124,109,255,0.125), rgba(124,109,255,0.02))',
          border: '1px solid rgba(26,0,255,0.19)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 2,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d={svgPaths.p2e0fe100} stroke="#3E54A0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
          </svg>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <p style={{
                fontFamily: "'Outfit:SemiBold', Outfit, sans-serif",
                fontWeight: 600, fontSize: 14,
                color: '#eee9ff', margin: 0, lineHeight: 1.4,
              }}>Full-Stack con React y Node.js</p>
              <p style={{
                fontFamily: "'Outfit:Regular', Outfit, sans-serif",
                fontSize: 12, color: '#7b8ab0', margin: 0,
              }}>Ing. en Sistemas · Editado hace 3 días</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: 'rgba(0,229,184,0.1)', border: '1px solid rgba(0,229,184,0.2)',
                borderRadius: 999, padding: '2px 8px',
              }}>
                <span style={{
                  fontFamily: "'Outfit:Medium', Outfit, sans-serif",
                  fontWeight: 500, fontSize: 10, color: '#00e5b8',
                }}>Público</span>
              </div>
              {/* View mode toggle */}
              <div style={{
                display: 'flex', alignItems: 'center',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid #1e2d4a',
                borderRadius: 8, overflow: 'hidden',
              }}>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 500,
                    fontFamily: "'Outfit:Medium', Outfit, sans-serif",
                    background: viewMode === 'list' ? '#2a3a70' : 'transparent',
                    color: viewMode === 'list' ? '#a0b4ff' : '#7b8ab0',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>≡</span> Lista
                </button>
                <div style={{ width: 1, height: 20, background: '#1e2d4a' }} />
                <button
                  onClick={() => setViewMode('map')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 500,
                    fontFamily: "'Outfit:Medium', Outfit, sans-serif",
                    background: viewMode === 'map' ? '#2a3a70' : 'transparent',
                    color: viewMode === 'map' ? '#a0b4ff' : '#7b8ab0',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>◈</span> Mapa
                </button>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ paddingBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{
                fontFamily: "'Outfit:Regular', Outfit, sans-serif",
                fontSize: 12, color: '#7b8ab0',
              }}>{doneCount} de {LIST_ITEMS.length} temas</span>
              <span style={{
                fontFamily: "'JetBrains Mono:Bold', 'JetBrains Mono', monospace",
                fontWeight: 700, fontSize: 12, color: '#5b74d8',
              }}>{pct}%</span>
            </div>
            <div style={{
              height: 6, borderRadius: 999,
              background: '#1a2540', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 999,
                width: `${pct}%`,
                background: 'linear-gradient(to right, #7c6dff, #00e5b8)',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ borderTop: '1px solid #1e2d4a' }}>
        {viewMode === 'list' ? (
          <div style={{ paddingTop: 16 }}>
            <RoadmapListView statuses={statuses} onStatusChange={onStatusChange} />
          </div>
        ) : (
          <div style={{ paddingTop: 8 }}>
            <RoadmapMapView statuses={statuses} onStatusChange={onStatusChange} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #1e2d4a',
        padding: '16px 20px',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <button style={{
          flex: '0 0 auto', width: 200,
          padding: '8px 0', borderRadius: 12,
          border: '1px solid #1e2d4a', background: 'transparent',
          fontFamily: "'Outfit:Regular', Outfit, sans-serif",
          fontSize: 12, color: '#7b8ab0', cursor: 'pointer',
        }}>
          Editar roadmap
        </button>
        <button style={{
          flex: 1, padding: '8px 0', borderRadius: 12,
          border: '1px solid rgba(0,46,66,0.3)',
          background: 'rgba(126,193,255,0.1)',
          fontFamily: "'Outfit:Medium', Outfit, sans-serif",
          fontSize: 12, color: '#5b74d8', cursor: 'pointer',
        }}>
          ← Ver fase anterior
        </button>
        <button style={{
          flex: 1, padding: '8px 0', borderRadius: 12,
          border: '1px solid rgba(0,46,66,0.3)',
          background: 'rgba(126,193,255,0.1)',
          fontFamily: "'Outfit:Medium', Outfit, sans-serif",
          fontSize: 12, color: '#5b74d8', cursor: 'pointer',
        }}>
          Ver siguiente fase →
        </button>
      </div>
    </div>
  );
}

// ─── ML Card (collapsed) ──────────────────────────────────────────────────────

function MLCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'rgba(0,0,0,0.54)',
      border: '1px solid #1e2d4a',
      borderRadius: 16, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'start',
        gap: 16, padding: 20,
        cursor: 'pointer',
      }} onClick={() => setExpanded(e => !e)}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(124,109,255,0.125), rgba(124,109,255,0.02))',
          border: '1px solid rgba(26,0,255,0.19)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 2,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d={svgPaths.p2e0fe100} stroke="#3E54A0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
            <div>
              <p style={{
                fontFamily: "'Outfit:SemiBold', Outfit, sans-serif",
                fontWeight: 600, fontSize: 14, color: '#eee9ff', margin: 0,
              }}>Machine Learning para ingenieros</p>
              <p style={{
                fontFamily: "'Outfit:Regular', Outfit, sans-serif",
                fontSize: 12, color: '#7b8ab0', margin: 0,
              }}>Ing. en Sistemas · Editado hace 2 semanas</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d={svgPaths.p32925740} stroke="#7B8AB0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: "'Outfit:Regular', Outfit, sans-serif", fontSize: 12, color: '#7b8ab0' }}>1 de 5 fases</span>
            <span style={{ fontFamily: "'JetBrains Mono:Bold', monospace", fontWeight: 700, fontSize: 12, color: '#7c6dff' }}>15%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: '#1a2540', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, width: '15%', background: 'linear-gradient(to right, #7c6dff, #00e5b8)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function RoadmapTabs({ tab, onChange }) {
  const tabs = [
    { id: 'mis', label: 'Mis RoadMaps' },
    { id: 'comunidad', label: 'Comunidad' },
    { id: 'nuevo', label: 'Crear Nuevo' },
  ];

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(0,0,0,0.54)',
      border: '1px solid #1e2d4a',
      borderRadius: 12, padding: 4,
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            cursor: 'pointer', transition: 'all 0.2s',
            background: tab === t.id ? '#3e54a0' : 'transparent',
            color: tab === t.id ? 'white' : '#7b8ab0',
            fontFamily: "'Outfit:Medium', Outfit, sans-serif",
            fontWeight: 500, fontSize: 12,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [tab, setTab] = useState('mis');
  const [statuses, setStatuses] = useState(INIT_STATUSES);

  const handleStatusChange = useCallback((id, s) => {
    setStatuses(prev => ({ ...prev, [id]: s }));
  }, []);

  return (
    <div>
      {/* Content */}
        {/* Right column */}
        <div style={{
          flex: 1, minWidth: 0,
          display: 'flex', flexDirection: 'column',
          height: '100%', overflow: 'hidden',
        }}>

          {/* Main content */}
          <main style={{
            flex: 1, overflowY: 'auto',
            padding: '0 10px 20px 0',
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.54)',
              backdropFilter: 'blur(5px)',
              borderRadius: 20,
              padding: 20,
              minHeight: '100%',
            }}>
              {/* Title */}
              <div style={{ marginBottom: 20 }}>
                <h1 style={{
                  fontFamily: "'Poppins:SemiBold', Poppins, sans-serif",
                  fontWeight: 600, fontSize: 28,
                  color: 'white', margin: '0 0 4px',
                }}>Roadmaps</h1>
                <p style={{
                  fontFamily: "'Roboto:Regular', Roboto, sans-serif",
                  fontSize: 21, color: '#ebebeb',
                  margin: 0, lineHeight: 1.3,
                }}>
                  Traza y gestiona tus rutas de aprendizaje universitario.
                </p>
              </div>

              {/* Tabs */}
              <div style={{ marginBottom: 24 }}>
                <RoadmapTabs tab={tab} onChange={setTab} />
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <FullStackCard statuses={statuses} onStatusChange={handleStatusChange} />
                <MLCard />
              </div>

              {/* Create button */}
              <div style={{ marginTop: 16 }}>
                <button style={{
                  width: '100%', padding: '12px 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(to right, #3daaed, #437de8)',
                  fontFamily: "'Outfit:SemiBold', Outfit, sans-serif",
                  fontWeight: 600, fontSize: 14,
                  color: 'white',
                }}>
                  Crear nuevo roadmap
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
}