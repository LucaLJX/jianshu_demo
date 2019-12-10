const lineList = [
  {
    name: 'A-1-14',
    id: 14,
    parentId: 1
  },
  {
    name: 'A-4',
    id: 4,
    parentId: null
  },
  {
    name: 'A-99-46',
    id: 9946,
    parentId: 99
  },
  {
    name: 'A-99-23',
    id: 9923,
    parentId: 99
  },
  {
    name: 'A-8',
    id: 8,
    parentId: null
  },
  {
    name: 'A-1-17',
    id: 17,
    parentId: 1
  },
  {
    name: 'A-8-23',
    id: 823,
    parentId: 8
  },
  {
    name: 'A-1',
    id: 1,
    parentId: null
  },
  {
    name: 'A-4-16',
    id: 416,
    parentId: 4
  },
  {
    name: 'A-1-15',
    id: 15,
    parentId: 1
  },
  {
    name: 'A-4-25',
    id: 425,
    parentId: 4
  },
  {
    name: 'A-1-12',
    id: 12,
    parentId: 1
  },
  {
    name: 'A-99-15',
    id: 9915,
    parentId: 99
  },
  {
    name: 'A-4-23',
    id: 423,
    parentId: 4
  },
  {
    name: 'A-1-16',
    id: 16,
    parentId: 1
  },
  {
    name: 'A-8-46',
    id: 846,
    parentId: 8
  },
  {
    name: 'A-8-15',
    id: 815,
    parentId: 8
  },
  {
    name: 'A-99',
    id: 99,
    parentId: null
  },
  {
    name: 'A-416-1',
    id: 41699,
    parentId: 416
  },
  {
    name: 'A-416-2',
    id: 4169,
    parentId: 416
  }
];

function fmtLineToTree (list, idStr, parentIdStr, childrenStr) {
  let [newArr, newObj, _idStr, _parentIdStr, _childrenStr] = [[], {}, idStr, parentIdStr, childrenStr];
  console.log(list);
}

fmtLineToTree(lineList);