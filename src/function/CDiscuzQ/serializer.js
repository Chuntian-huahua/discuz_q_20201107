function sortDataRelationShips(resultData) {
  let attributes = resultData["attributes"];
  let relationshipsSource = resultData["relationships"];
  let relationships = {};
  for (let key in relationshipsSource) {
    let relationshipsData = relationshipsSource[key]["data"];
    if (Array.isArray(relationshipsData)) {
      relationships[key] = [];
      relationshipsData.forEach((item) => {
        relationships[key].push(item.id);
      });
    } else {
      relationships[relationshipsData["type"]] = relationshipsData["id"];
    }
  }

  attributes["relationships"] = relationships;
  attributes["_source"] = {
    type: resultData["type"],
    id: resultData["id"],
  };
  if (resultData["mate"]) {
    attributes["mate"] = resultData["mate"];
  }
  resultData = attributes;
  return resultData;
}

export default function(sourceData) {
  let resultData = JSON.parse(JSON.stringify(sourceData.data));
  if (resultData.length === 0) {
    return sourceData;
  }
  let resultIncluded = sourceData.included;

  if (Array.isArray(resultData)) {
    for (let index in resultData) {
      resultData[index] = sortDataRelationShips(resultData[index]);
    }
  } else {
    resultData = sortDataRelationShips(resultData);
  }

  const included = {};
  if (resultIncluded && resultIncluded.length > 0) {
    resultIncluded.forEach((includItem) => {
      if (!included[includItem["type"]]) {
        included[includItem["type"]] = {};
      }

      let attributes = includItem["attributes"];
      if (includItem["relationships"]) {
        for (let key in includItem["relationships"]) {
          let types = {};
          let data = includItem["relationships"][key]["data"];
          if (Array.isArray(data)) {
            data.forEach((item) => {
              if (key === item["type"]) {
                if (!Array.isArray(types)) {
                  types = [];
                }
                types.push(item["id"]);
              } else {
                if (!types[item["type"]]) {
                  types[item["type"]] = [];
                }
                types[item["type"]].push(item["id"]);
              }
            });
          } else {
            types[data["type"]] = data["id"];
          }

          includItem["relationships"][key] = types;
        }
        attributes["relationships"] = includItem["relationships"];
      }
      attributes["_source"] = {
        id: includItem["id"],
        type: includItem["type"],
      };
      if (includItem["mate"]) {
        attributes["_source"]["mate"] = includItem["mate"];
      }

      included[includItem["type"]][includItem["id"]] = attributes;
    });

    for (const type in included) {
      for (const id in included[type]) {
        let includeItem = included[type][id];
        if (!includeItem["relationships"]) {
          continue;
        }
        let relationships = includeItem["relationships"];
        for (let typeItem in relationships) {
          if (Array.isArray(relationships[typeItem])) {
            let typeData = included[typeItem];
            let relationData = [];
            for (let i = 0; i < relationships[typeItem].length; i++) {
              relationData.push(typeData[relationships[typeItem][i]]);
            }
            if (relationData.length === 1) {
              relationData = relationData[0];
            }
            relationships[typeItem] = relationData;
          } else {
            for (let subType in relationships[typeItem]) {
              let subTypeData = relationships[typeItem][subType];
              let typeData = included[subType];
              let relationData = [];
              for (let i = 0; i < subTypeData.length; i++) {
                relationData.push(typeData[subTypeData[i]]);
              }
              if (relationData.length === 1) {
                relationData = relationData[0];
              }
              relationships[typeItem][subType] = relationData;
            }
          }
        }
        Object.assign(included[type][id], relationships);
        delete included[type][id]["relationships"];
      }
    }
  }

  if (Array.isArray(resultData)) {
    for (let index in resultData) {
      let relationships = resultData[index]["relationships"];
      for (let type in relationships) {
        if (!Array.isArray(relationships[type])) {
          relationships[type] = included[type][relationships[type]];
        }
      }
      Object.assign(resultData[index], relationships);
      delete resultData[index]["relationships"];
    }

    delete sourceData["data"];
    delete sourceData["included"];
    let returnData = {
      data: resultData,
      included,
      ...sourceData,
    };
    return returnData;
  } else {
    let relationships = resultData["relationships"];
    for (let type in relationships) {
      if (typeof relationships[type] !== "object") {
        relationships[type] = included[type][relationships[type]];
      }
    }
    Object.assign(resultData, relationships);
    delete resultData["relationships"];
    delete sourceData["data"];
    delete sourceData["included"];
    return {
      data: resultData,
      included,
      ...sourceData
    };
  }
}
