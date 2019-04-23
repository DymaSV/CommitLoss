import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TreeNodeDto } from 'src/app/models/tree-node.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  url = 'http://localhost:2201/node';
  constructor(private http: HttpClient) {}

  public Get(): Observable<TreeNodeDto[]> {
    return this.http.get<TreeNodeDto[]>(this.url);
  }
}
