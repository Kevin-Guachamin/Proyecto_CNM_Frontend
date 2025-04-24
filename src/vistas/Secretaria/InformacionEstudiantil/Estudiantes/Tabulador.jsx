import React from 'react';
import '../../../Admin/Styles/TabSwitcher.css';
import { X } from 'lucide-react';


const TabSwitcher = ({ tabs, activeTabId, setActiveTabId, activeTabs, setActiveTabs}) => {
  const firstTabId = tabs[0]?.id;

  

  const closeTab = (id) => {
    if (id === firstTabId) return; // No permitir cerrar la primera pestaña

    const newTabs = activeTabs.filter(tabId => tabId !== id);
    setActiveTabs(newTabs);

    if (id === activeTabId) {
      setActiveTabId(newTabs.length ? newTabs[0] : firstTabId);
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="tab-switcher-container">
      {/* Botones de pestañas activas */}
      <div className="tab-buttons">
        {activeTabs.map(id => {
          const tab = tabs.find(t => t.id === id);
          const isFirst = id === firstTabId;
          return (
            <div key={id} className={`tab-button ${id === activeTabId ? 'active' : ''}`}>
              <button onClick={() => setActiveTabId(id)}>{tab.label}</button>
              {!isFirst && (
                <span className="close-tab" onClick={() => closeTab(id)}>
                <X size={18} />
              </span>
              )}
              
            </div>
          );
        })}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="tab-content-tabulador">
        {activeTab ? (
          activeTab.render ? (
            // Si la pestaña usa 'render', pasamos openTab
            activeTab.render
          ) : activeTab.component ? (
            // Si la pestaña usa 'component', clonamos el componente y le pasamos openTab
            activeTab.component
          ) : (
            <div className="tab-empty">No hay contenido definido.</div>
          )
        ) : (
          <div className="tab-empty">No hay pestañas activas.</div>
        )}
      </div>
    </div>
  );
};

export default TabSwitcher;
