import type { ReactNode } from 'react';

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
};

const Tabs = ({ tabs, activeId, onChange }: TabsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-fast ${activeId === tab.id ? 'bg-ink text-white' : 'bg-white text-muted border border-border hover:border-ink hover:text-ink'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((tab) => tab.id === activeId)?.content}</div>
    </div>
  );
};

export default Tabs;
