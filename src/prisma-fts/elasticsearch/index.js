// @ts-nocheck
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  deleteDocOnElasticsearch: () => deleteDocOnElasticsearch,
  elasticsearchFTS: () => elasticsearchFTS,
  saveDocOnElasticsearch: () => saveDocOnElasticsearch,
  searchByElasticsearchIndexes: () => searchByElasticsearchIndexes
});
module.exports = __toCommonJS(src_exports);
var import_core = require("@prisma-fts/core");
var saveDocOnElasticsearch = async (client, indexMapping, data, pk) => {
  const selectedColumns = Object.keys(data);
  if (!data[pk] || !Object.keys(indexMapping).every((key) => selectedColumns.includes(key)))
    throw new Error(
      `Selected columns are missing for index mapping keys; either omit the select parameter or specify select to cover all index mapping keys and the primary key (${pk}).`
    );
  const objectMapping = Object.entries(indexMapping).reduce((res, [column, index]) => {
    if (!data[column])
      return res;
    if (!res[index])
      return { ...res, [index]: { [column]: data[column] } };
    return {
      ...res,
      [index]: {
        ...res[index],
        [column]: data[column]
      }
    };
  }, {});
  return Promise.all(
    Object.entries(objectMapping).map(
      ([index, document]) => client.index({
        index,
        id: String(data[pk]),
        document
      })
    )
  );
};
var deleteDocOnElasticsearch = async (client, indexMapping, data, pk) => {
  if (!data[pk])
    throw new Error(
      `The selected column does not have a primary key; either omit the select parameter or specify select to cover the primary key (${pk}).`
    );
  return Promise.all(
    [...new Set(Object.values(indexMapping))].map(
      (index) => client.delete({ index, id: String(data[pk]) })
    )
  );
};
var searchByElasticsearchIndexes = async (client, indexMapping, mapping, pkIsNumber) => {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(mapping).map(async ([key, val]) => {
        const [col] = key.match(/[^.]+$/) ?? [];
        const index = indexMapping[col];
        const [option] = val.match(/\{.*}$/) ?? ["{}"];

        const optionObjRaw = JSON.parse(option)
        // remove searchOptions from match options
        const { searchOptions, ...matchOptions } = optionObjRaw  
        
        const res = await client.search({
          index,
          ...searchOptions,
          query: {
            fuzzy: {
              [col]: {
                value: val.replace(/\{.*}$/, ""),
                ...matchOptions
              }
            }
          }
        });
        return [
          key,
          res.hits.hits.map(({ _id }) => pkIsNumber ? Number(_id) : _id)
        ];
      })
    )
  );
};
var elasticsearchFTS = (client, dmmf, indexes, options) => async (params, next) => {
  var _a, _b, _c, _d, _e, _f, _g;
  if (!params.model || !indexes[params.model])
    return next(params);
  const indexMapping = indexes[params.model].indexes;
  const pk = indexes[params.model].docId;
  const pkIsNumber = ((_b = (_a = dmmf.datamodel.models.find(({ name }) => name === params.model)) == null ? void 0 : _a.fields.find(({ name }) => name === pk)) == null ? void 0 : _b.type) === "Int";
  if (["findMany", "findFirst", "groupBy", "count", "aggregate"].includes(
    params.action
  ) && ((_c = params.args) == null ? void 0 : _c.where)) {
    params.args.where = (0, import_core.getNewWhereArg)(
      params.args.where,
      await searchByElasticsearchIndexes(
        client,
        indexMapping,
        (0, import_core.getSearchStringMapping)(Object.keys(indexMapping), params.args.where),
        pkIsNumber
      ),
      pk
    );
    return next(params);
  }
  if (params.action === "create" && ((_d = options == null ? void 0 : options.syncOn) == null ? void 0 : _d.includes("create"))) {
    const record = await next(params);
    await saveDocOnElasticsearch(client, indexMapping, record, pk);
    return record;
  }
  if (params.action === "upsert" && ((_e = options == null ? void 0 : options.syncOn) == null ? void 0 : _e.includes("upsert"))) {
    const record = await next(params);
    await saveDocOnElasticsearch(client, indexMapping, record, pk);
    return record;
  }
  if (params.action === "update" && ((_f = options == null ? void 0 : options.syncOn) == null ? void 0 : _f.includes("update"))) {
    const record = await next(params);
    await saveDocOnElasticsearch(client, indexMapping, record, pk);
    return record;
  }
  if (params.action === "delete" && ((_g = options == null ? void 0 : options.syncOn) == null ? void 0 : _g.includes("delete"))) {
    const record = await next(params);
    await deleteDocOnElasticsearch(client, indexMapping, record, pk);
    return record;
  }
  return next(params);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteDocOnElasticsearch,
  elasticsearchFTS,
  saveDocOnElasticsearch,
  searchByElasticsearchIndexes
});
//# sourceMappingURL=index.js.map