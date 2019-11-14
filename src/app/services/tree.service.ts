import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TreeNodeDto } from 'src/app/models/tree-node.dto';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class TreeService {
  getNodesUrl = 'http://localhost:2201/nodes';
  postChangesUrl = 'http://localhost:2201/save';
  getAliasUrl = 'http://localhost:2201/getAlias';
  constructor(private http: HttpClient) {}

  public getNodes(): Observable<TreeNodeDto[]> {
    return this.http.get<TreeNodeDto[]>(this.getNodesUrl);
  }

  public saveChangedValues(node: TreeNodeDto): Observable<any> {
    return this.http.post(this.postChangesUrl, node, httpOptions);
  }

  public getAlias(alias: string): Observable<string> {
    return this.http.post<string>(this.getAliasUrl, alias, httpOptions);
  }

  public getAliasTest(alias: string): Observable<string> {
    return of('1111');
  }
}
