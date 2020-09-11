import {getRequest} from './api'
import {Message} from 'element-ui'

export const isNotNullORBlank = (...args)=> {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == '' || argument == undefined) {
      Message.warning({message: '数据不能为空!'})
      return false;
    }
  }
  return true;
}
export const initMenu = (router, store)=> {

  if (store.state.routes.length > 0) {
    return;
  }
  getRequest("").then(resp=> {
    if (resp && resp.status == 200) {
      var fmtRoutes = formatRoutes([
        {
          "id": 2,
          "path": "/home",
          "component": "Home",
          "name": "安全监测",
          "iconCls": "fa fa-user-circle-o",
          "children": [
            {
              "id": null,
              "path": "/emp/basic",
              "component": "EmpBasic",
              "name": "模拟量实时监测",
              "iconCls": null,
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            },
            {
              "id": null,
              "path": "/emp/switch",
              "component": "EmpSwitch",
              "name": "开关实时监测",
              "iconCls": null,
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            }
          ],
          "meta": {
            "keepAlive": false,
            "requireAuth": true
          }
        },
        {
          "id": 3,
          "path": "/home",
          "component": "Home",
          "name": "人员定位",
          "iconCls": "fa fa-address-card-o",
          "children": [
            {
              "id": null,
              "path": "/per/deletion",
              "component": "PerDe",
              "name": "人员实时监测",
              "iconCls": null,
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            }
          ],
          "meta": {
            "keepAlive": false,
            "requireAuth": true
          }
        },
        {
          "id": 4,
          "path": "/home",
          "component": "Home",
          "name": "应力监测",
          "iconCls": "fa fa-money",
          "children": [
            {
              "id": null,
              "path": "/sal/sob",
              "component": "SalYlcc",
              "name": "应力实时监测",
              "iconCls": null,
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            },
            {
              "id": null,
              "path": "/sal/sobcfg",
              "component": "SalYtzjssjc",
              "name": "液压支架实时监测",
              "iconCls": null,
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            }
          ],
          "meta": {
            "keepAlive": false,
            "requireAuth": true
          }
        },
        {
          "id": 5,
          "path": "/home",
          "component": "Home",
          "name": "矿震监测",
          "iconCls": "fa fa-bar-chart",
          "children": [
            {
              "id": null,
              "path": "/sta/all",
              "component": "Stassjc",
              "name": "矿震实时监测",
              "iconCls": null,
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            }
          ],
          "meta": {
            "keepAlive": false,
            "requireAuth": true
          }
        },
        {
          "id": 6,
          "path": "/home",
          "component": "Home",
          "name": "水文监测",
          "iconCls": "fa fa-windows",
          "children": [
            {
              "id": null,
              "path": "/SW/basic",
              "component": "SWssjc",
              "name": "水文实时监测",
              "iconCls": null,
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            }
          ],
          "meta": {
            "keepAlive": false,
            "requireAuth": true
          }
        },
        {
          "id": 7,
          "path": "/home",
          "component": "Home",
          "name": "文件上传监控",
          "iconCls": "fa fa-windows",
          "children": [
            
            {
              "id": null,
              "path": "/Fup/system",
              "component": "FupjkSystem",
              "name": "各系统上传监控",
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            },
            {
              "id": null,
              "path": "/Fup/all",
              "component": "Fupssjk",
              "name": "上传日志查询",
              "iconCls": null,
              "children": [],
              "meta": {
                "keepAlive": false,
                "requireAuth": true
              }
            },
          ],
          "meta": {
            "keepAlive": false,
            "requireAuth": true
          }
        }
      ]);
      console.log(router);
      router.addRoutes(fmtRoutes);

      store.commit('initMenu', fmtRoutes);

      store.dispatch('connect');
    }
  })
}
export const formatRoutes = (routes)=> {

  let fmRoutes = [];
  routes.forEach(router=> {

    let {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    let fmRouter = {
      path: path,
      component(resolve){
        if (component.startsWith("Home")) {

          require(['../components/' + component + '.vue'], resolve)
        } else if (component.startsWith("Emp")) {
          require(['../components/emp/' + component + '.vue'], resolve)
        }
        else if (component.startsWith("Per")) {
          require(['../components/per/' + component + '.vue'], resolve)
        }
        else if (component.startsWith("Sal")) {
          require(['../components/Sal/' + component + '.vue'], resolve)
        }
       else if (component.startsWith("Sta")) {
          require(['../components/sta/' + component + '.vue'], resolve)
        } else if (component.startsWith("SW")) {
          require(['../components/SW/' + component + '.vue'], resolve)
        } else if (component.startsWith("Fup")) {
          require(['../components/Fup/' + component + '.vue'], resolve)
        }
      },
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children
    };
    fmRoutes.push(fmRouter);
  })
  return fmRoutes;
}
