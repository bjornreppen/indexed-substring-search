export interface INode {
  [key: string | number]: any;
}

export type IResultEntry = [number, number];

export type IResult = {
  [key: string | number]: IResultEntry[];
};

export type Index = {
  root: INode;
  map: Map;
};

type Map = {
  [key: string]: number;
};

export type ReverseMap = {
  [key: number]: string;
};
