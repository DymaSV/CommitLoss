import { Injectable } from '@angular/core';
import { TreeItemNode } from '../models/tree-node';
import { TreeNodeDto } from '../models/tree-node.dto';

@Injectable({
  providedIn: 'root'
})
export class TreeNodeTranslator {
  itemNodeToDto(treeItem: TreeItemNode): TreeNodeDto {
    const treeItemDto: TreeNodeDto = new TreeNodeDto();
    treeItemDto.name = treeItem.name;
    treeItemDto.alias = treeItem.alias;
    treeItemDto.id = treeItem.id;
    treeItemDto.income = treeItem.income;
    treeItemDto.outcome = treeItem.outcome;
    treeItemDto.children = this.itemNodeArrayToArrayDto(treeItem.children);
    return treeItemDto;
  }

  private itemNodeArrayToArrayDto(treeItem: TreeItemNode[]): TreeNodeDto[] | null {
    if (!!treeItem) {
      const array: TreeNodeDto[] = [];
      treeItem.forEach(element => {
        const treeNodeDto = new TreeNodeDto();
        treeNodeDto.name = element.name;
        treeNodeDto.alias = element.alias;
        treeNodeDto.id = element.id;
        treeNodeDto.income = element.income;
        treeNodeDto.outcome = element.outcome;
        treeNodeDto.children = this.itemNodeArrayToArrayDto(element.children);
        array.push(treeNodeDto);
      });
      return array;
    } else {
      return null;
    }
  }
}
