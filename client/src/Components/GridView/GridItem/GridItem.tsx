import * as React from 'react';
import './GridItem.scss';

interface GridItemProps {
  title?: string;
  children: React.ReactNode;
}

const GridItem: React.FC<GridItemProps> = ({ children, title }) => {
  return (
    <div className="grid-item-component">
      {title && <span className="item-title">{title}</span>}
      <span style={{float:'right', margin:10}}>
        <em style={{ color: "red", marginRight:'10px' }}>Connection error</em>
        <button>Refresh</button>
      </span>
      <div className="item-container">

        <div className="item-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default GridItem;
