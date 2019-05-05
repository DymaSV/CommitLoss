/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TreeNodeTranslator } from './tree-node.translator';

describe('Service: TreeNode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeNodeTranslator]
    });
  });

  it('should ...', inject([TreeNodeTranslator], (service: TreeNodeTranslator) => {
    expect(service).toBeTruthy();
  }));
});
