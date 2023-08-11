import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {
  ITreeOptions,
  ITreeState,
  TreeComponent,
  TreeModel,
  TreeNode,
} from '@circlon/angular-tree-component';
import { omitBy } from 'lodash';
type Data = {
  id: string;
  name: string;
  children?: Data[];
};

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements AfterViewInit {
  treeModel: TreeModel;
  treeData: TreeNode[] = [];
  @ViewChild('tree') treeComponent: TreeComponent;
  options: ITreeOptions = { useCheckbox: true, useTriState: true };
  nodes: Data[] = [
    {
      id: 'a',
      name: 'root1',
      children: [
        { id: 'b', name: 'child1' },
        { id: 'c', name: 'child2' },
      ],
    },
    {
      id: 'd',
      name: 'root2',
      children: [
        { id: 'h', name: 'child2.1' },
        {
          id: 'i',
          name: 'child2.2',
          children: [
            { id: 'g', name: 'subsub', children: [{ id: 'h', name: 'hello' }] },
          ],
        },
      ],
    },
    {
      id: 'i',
      name: 'foo',
      children: [{ id: 'j', name: 'jerom' }],
    },
  ];

  ngAfterViewInit(): void {
    this.treeModel = this.treeComponent.treeModel;
    this.initiateSelectStatus(this.nodes);
    this.treeModel.update();
    this.treeModel?.subscribeToState((state: ITreeState) => {
      console.log(
        'dispatch',
        omitBy(
          Object.assign({}, state.selectedLeafNodeIds),
          (nodeSelected) => nodeSelected === true
        )
      );
    });
  }
  initiateSelectStatus(nodes: Data[]) {
    for (const node of nodes) {
      let treeNode: TreeNode = this.treeModel.getNodeById(node.id);
      treeNode.setIsSelected(true);

      if (node.children) {
        this.initiateSelectStatus(node.children);
      }
    }
  }
  toggleNode(node: TreeNode) {
    this.treeModel.setExpandedNode(
      node,
      this.treeModel.isActive(node) ? false : true
    );
  }
  selectedNode(event: any) {
    console.log(
      'dispatch 2',
      omitBy(
        Object.assign({}, this.treeModel.selectedLeafNodeIds),
        (nodeSelected) => nodeSelected === true
      )
    );
  }
  selectNode(node: TreeNode) {
    node.setIsSelected(node.isSelected ? false : true);
  }
}
