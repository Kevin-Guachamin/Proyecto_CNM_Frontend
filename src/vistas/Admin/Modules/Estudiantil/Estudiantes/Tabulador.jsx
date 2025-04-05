import React, { useState } from 'react';
import '../../../Styles/TabSwitcher.css';

const TabSwitcher = ({ tabs }) => {
    const firstTabId = tabs[0]?.id;
    const [activeTabs, setActiveTabs] = useState([firstTabId]);
    const [activeTabId, setActiveTabId] = useState(firstTabId);
  
    const openTab = (id) => {
      if (!activeTabs.includes(id)) {
        setActiveTabs([...activeTabs, id]);
      }
      setActiveTabId(id);
    };
  
    const closeTab = (id) => {
      // No permitir cerrar la primera pestaña
      if (id === firstTabId) return;
  
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
                  <span className="close-tab" onClick={() => closeTab(id)}>×</span>
                )}
              </div>
            );
          })}
        </div>
  
        {/* Contenido de la pestaña activa */}
        <div className="tab-content">
          {activeTab ? (
            typeof activeTab.render === 'function'
              ? activeTab.render({ setActiveTabId: openTab })
              : activeTab.component || <div className="tab-empty">No hay contenido definido.</div>
          ) : (
            <div className="tab-empty">No hay pestañas activas.</div>
          )}
        </div>
      </div>
    );
  };
  
  export default TabSwitcher;
