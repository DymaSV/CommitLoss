import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { TreeItemFlatNode } from 'src/app/models/tree-node-flat';
import { TreeItemNode } from 'src/app/models/tree-node';
import { TreeNodeDto } from 'src/app/models/tree-node.dto';
import { TreeService } from 'src/app/services/tree.service';
import { ParserTranslator } from '../translators/parser.translator';

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TreeItemNode[]>([]);
  maxItemNodeId = 0;
  get data(): TreeItemNode[] {
    return this.dataChange.value;
  }

  constructor(private treeSrvice: TreeService) {
    this.initialize();
  }

  initialize() {
    this.treeSrvice.Get().subscribe(s => {
      const data = this.buildFileTree(s, 0);
      this.dataChange.next(data);
    });
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TreeItemNode`.
   */
  buildFileTree(obj: TreeNodeDto[], level: number): TreeItemNode[] {
    return Object.keys(obj).reduce<TreeItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeItemNode();
      node.id = value.id;
      node.name = value.name;
      node.alias = value.alias;
      node.income = value.income;
      node.outcome = value.outcome;
      if (this.maxItemNodeId < value.id) {
        this.maxItemNodeId = value.id;
      }
      if (value != null) {
        if (typeof value === 'object' && value.children !== null) {
          node.children = this.buildFileTree(value.children, level + 1);
        } else {
          node.name = value.name;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TreeItemNode, nodeName: string) {
    if (parent.children) {
      const newItem = new TreeItemNode();
      newItem.id = this.maxItemNodeId;
      this.maxItemNodeId++;
      newItem.name = nodeName;
      newItem.alias = this.createAlias(newItem.name);
      newItem.income = 0;
      newItem.outcome = 0;
      newItem.children = null;
      parent.children.push(newItem);
      this.dataChange.next(this.data);
    }
  }

  createAlias(name: string): string {
    return null;
  }

  updateItem(node: TreeItemNode, nodeName: string) {
    node.name = nodeName;
    node.alias = this.createAlias(node.name);
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tree-list',
  templateUrl: 'tree-list.html',
  styleUrls: ['tree-list.css'],
  providers: [ChecklistDatabase]
})
export class TreeListComponent {
  protected value: string;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TreeItemFlatNode, TreeItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TreeItemNode, TreeItemFlatNode>();

  /** Map from alias to flattened node. This helps us object by alias */
  aliasNodeMap = new Map<string, TreeItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TreeItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TreeItemFlatNode>;

  treeFlattener: MatTreeFlattener<TreeItemNode, TreeItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TreeItemNode, TreeItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TreeItemFlatNode>(
    true /* multiple */
  );

  constructor(
    private database: ChecklistDatabase,
    private translator: ParserTranslator
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TreeItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: TreeItemFlatNode) => node.level;

  isExpandable = (node: TreeItemFlatNode) => node.expandable;

  getChildren = (node: TreeItemNode): TreeItemNode[] => node.children;

  hasChild = (_: number, nodeData: TreeItemFlatNode) => nodeData.expandable;

  hasNoContent = (_: number, nodeData: TreeItemFlatNode) =>
    nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TreeItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.id === node.id
        ? existingNode
        : new TreeItemFlatNode();
    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.alias = node.alias;
    flatNode.income = node.income;
    flatNode.outcome = node.outcome;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    this.aliasNodeMap.set(flatNode.alias, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TreeItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TreeItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.setValue();
  }

  setValue() {
    this.value =
      this.checklistSelection.selected.length > 0
        ? Object.values(this.checklistSelection.selected)
            .map(item => item.alias)
            .join(';')
        : null;
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TreeItemFlatNode): void {
    let parent: TreeItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TreeItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TreeItemFlatNode): TreeItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TreeItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    // tslint:disable-next-line:no-non-null-assertion
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TreeItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    // tslint:disable-next-line:no-non-null-assertion
    this.database.updateItem(nestedNode!, itemValue);
  }

  pressEnter() {
    this.translator.parseValue(this.value);
  }
}
