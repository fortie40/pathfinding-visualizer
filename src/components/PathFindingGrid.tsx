/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ForwardedRef, RefObject } from 'react';
import { startNode, targetNode, createDraggble } from '../helperFunctions/helperFunctions';
import { RowsType, RowType, NodeType } from '../helperFunctions/types';
import './PathFindingGrid.css';

interface Props {
  pfGridHeight: number;
  marginTop: number;
  pfGridRows: RowsType;
  nodesRef: RefObject<Array<HTMLDivElement>>;
  noOfNodes: number;
  // eslint-disable-next-line no-unused-vars
  onMouseDown: (elem: HTMLElement) => void;
  // eslint-disable-next-line no-unused-vars
  onMouseEnter: (elem: HTMLElement,) => void;
}

const PathFindingGrid = React.forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    pfGridHeight,
    marginTop,
    pfGridRows,
    nodesRef,
    noOfNodes,
    onMouseDown,
    onMouseEnter,
  } = props;

  let iNode: HTMLElement[] = [];
  const createStartTargetNode = (node: HTMLDivElement, nodeIndex: number, type: string) => {
    if (iNode.length > nodeIndex) {
      iNode.forEach((elem: HTMLElement) => {
        elem.remove();
      });
      iNode = [];
    }
    iNode[nodeIndex] = document.createElement('i');
    if (type === startNode) {
      iNode[nodeIndex].classList.add('large', 'chevron', 'right', 'icon', type);
      node?.appendChild(iNode[nodeIndex]);
    }

    if (type === targetNode) {
      iNode[nodeIndex].classList.add('large', 'bullseye', 'icon', type);
      node?.appendChild(iNode[nodeIndex]);
    }
    createDraggble(type, nodeIndex, noOfNodes, nodesRef.current);
  };

  return (
    <div
      ref={ref}
      className="pf-grid"
      style={{
        border: '1px solid #007bff',
        height: `${pfGridHeight}px`,
        marginLeft: '60px',
      }}
    >
      <div className="pf-grid-node-holder" style={{ marginTop }}>
        {
          pfGridRows.length === 0 ? ''
            : pfGridRows.map((row: RowType, idxC: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="pf-grid-nodes-row" key={idxC}>
                {
                  row.map((node: NodeType, idxR: number) => {
                    const {
                      isNodeInFirstCol, isNodeInLastRow, isStartNode, isTargetNode, isWallNode,
                      isBombNode, idx,
                    } = node;
                    const firstColNode = isNodeInFirstCol ? 'first-col-node' : '';
                    const lastRowNode = isNodeInLastRow ? 'last-row-node' : '';
                    const wallNode = isWallNode ? 'wall-node' : '';

                    return (
                      <div
                        className={`pf-grid-node ${firstColNode} ${lastRowNode} ${wallNode}`}
                        // eslint-disable-next-line react/no-array-index-key
                        key={idxR}
                        ref={(element: HTMLDivElement) => {
                          if (isStartNode) createStartTargetNode(element, idx, startNode);
                          if (isTargetNode) createStartTargetNode(element, idx, targetNode);
                          nodesRef.current!![idx] = element;
                        }}
                        data-is-start-node={isStartNode}
                        data-is-target-node={isTargetNode}
                        data-is-wall-node={isWallNode}
                        data-is-bomb-node={isBombNode}
                        data-idx={idx}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onMouseDown(nodesRef.current!![idx]);
                        }}
                        onMouseEnter={(e) => {
                          e.preventDefault();
                          onMouseEnter(nodesRef.current!![idx]);
                        }}
                      />
                    );
                  })
                }
              </div>
            ))
        }
      </div>
    </div>
  );
});

export default PathFindingGrid;
