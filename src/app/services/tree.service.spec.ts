import { TreeService } from './tree.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed, inject, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { TreeNodeDto } from '../models/tree-node.dto';
import { of } from 'rxjs';

describe('GithubApiService', () => {
  let service: TreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TreeService]
    });
    service = TestBed.get(TreeService);
  });

  it('should use TreeService', () => {
    const treeNode = new Array<TreeNodeDto>();
    expect(service.getNodes()).toBe(of(treeNode));
  });
});
