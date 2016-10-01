var ColumnDefs = ColumnDefs || {};

ColumnDefs = {
	productGridDef : [
			{
				name : '操作',
				width : 130,
				enableSorting : false,
				cellTemplate : '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-primary btn-sm" ng-disabled="row.entity.productStatus!=2" ng-click="grid.appScope.bot(row.entity.product.productId);">BOT+1</button><button type="button" class="btn btn-primary btn-sm" ng-confirm-click="确定要删除该产品吗?" confirmed-click="grid.appScope.delProduct(row.entity.product.productId);">删除</button></div>'
			},
			{
				name : 'ID',
				field : 'product.productId',
				width : 55
			},
			{
				name : '产品名',
				field : 'product.name',
				width : 280,
				cellTemplate : '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.editProduct(row.entity.product.productId);">{{row.entity.product.name}}</a></div>'
			},
			{
				name : '当前价格',
				field : 'currentPrice',
				enableSorting : false,
				width : 90
			},
			{
				name : '库存',
				field : 'stock',
				enableSorting : false,
				width : 60
			},
			{
				name : '销量',
				field : 'sold',
				enableSorting : false,
				width : 60
			},
			{
				name : '真实销量',
				field : 'realSold',
				enableSorting : false,
				width : 60
			},
			{
				name : '置顶',
				field : 'fixTop',
				enableSorting : false,
				width : 60
			},
			{
				name : '打群价',
				field : 'isPromoted',
				enableSorting : false,
				width : 60
			},
			{
				name : '产品状态',
				field : 'status4Show',
				width : 90
			},
			{
				name : '起始时间',
				field : 'startDate',
				width : 140,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.startDate | date:'yyyy-MM-dd HH:mm'}}</div>"
			},
			{
				name : '过期时间',
				field : 'expiredDate',
				width : 140,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.expiredDate | date:'yyyy-MM-dd HH:mm'}}</div>"
			} ],

	orderGridDef : [
			{
				name : 'ID',
				field : 'orderId',
				width : 60
			},
			{
				name : '订单编号',
				field : 'trackingId',
				width : 170,
				cellTemplate : '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.viewOrder(row.entity.orderId);">{{row.entity.trackingId}}</a></div>'
			},
			{
				name : '产品名',
				field : 'productDesc',
				width : 300
			},
			{
				name : '购买数量',
				field : 'quantity',
				enableSorting : false,
				width : 80,
				cellTemplate : "<div class='ui-grid-cell-contents' ng-if='row.entity.quantity!=null'>{{row.entity.quantity}}</div><div class='ui-grid-cell-contents' ng-if='row.entity.quantity==null'>N/A</div>"
			},
			{
				name : '购买单价',
				field : 'unitPrice',
				enableSorting : false,
				width : 80,
				cellTemplate : "<div class='ui-grid-cell-contents' ng-if='row.entity.unitPrice!=null'>￥{{row.entity.unitPrice}}</div><div class='ui-grid-cell-contents' ng-if='row.entity.unitPrice==null'>N/A</div>"
			},
			{
				name : '邮费',
				field : 'postFee',
				enableSorting : false,
				width : 80,
				cellTemplate : "<div class='ui-grid-cell-contents'>￥{{row.entity.postFee}}</div>"
			},
			{
				name : '总金额',
				field : 'totalPrice',
				enableSorting : false,
				width : 80,
				cellTemplate : "<div class='ui-grid-cell-contents'>￥{{row.entity.totalPrice}}</div>"
			},
			{
				name : '用户',
				field : 'userName',
				width : 80
			},
			{
				name : '订单状态',
				field : 'orderStatus4Show',
				enableSorting : false,
				width : 80,
				cellTemplate : '<div ng-class="{true: \'label-ember\'}[row.entity.orderStatus==2]" class="ui-grid-cell-contents">{{row.entity.orderStatus4Show}}</div>'
			},
			{
				name : '购买时间',
				field : 'orderDate',
				width : 140,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.orderDate | date:'yyyy-MM-dd HH:mm'}}</div>"
			} ],

	clientGridDef : [
			{
				name : 'ID',
				field : 'userId',
				width : 60
			},
			{
				name : '用户名',
				field : 'userName',
				width : 100,
				cellTemplate : '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.editUser(row.entity.userId);">{{row.entity.userName}}</a></div>'
			},
			{
				name : '位置',
				field : 'province',
				enableSorting : false,
				width : 100,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.province}} {{row.entity.city}}</div>"
			},
			{
				name : '手机',
				field : 'mobile',
				enableSorting : false,
				width : 120
			},
			{
				name : '邮箱',
				field : 'email',
				enableSorting : false,
				width : 140
			},
			{
				name : '上次登录时间',
				field : 'lastVisitDate',
				width : 140,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.lastVisitDate | date:'yyyy-MM-dd HH:mm'}}</div>"
			},
			{
				name : '上次登录IP',
				field : 'lastVisitIP',
				enableSorting : false,
				width : 140
			},
			{
				name : '注册时间',
				field : 'createdDate',
				width : 140,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.createdDate | date:'yyyy-MM-dd HH:mm'}}</div>"
			} ],

	salesGridDef : [
			{
				name : 'ID',
				field : 'userId',
				width : 60
			},
			{
				name : '用户名',
				field : 'userName',
				width : 100,
				cellTemplate : '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.editUser(row.entity.userId);">{{row.entity.userName}}</a></div>'
			},
			{
				name : '手机',
				field : 'mobile',
				enableSorting : false,
				width : 120
			},
			{
				name : '本周推广用户数',
				field : 'refUserNumWTD',
				enableSorting : false,
				width : 120
			},
			{
				name : '本周推广订单数',
				field : 'refOrderNumWTD',
				enableSorting : false,
				width : 120
			},
			{
				name : '本周推广业绩',
				field : 'refAmountWTD',
				enableSorting : false,
				width : 120,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.refAmountWTD.toFixed(2)}}</div>"
			},
			{
				name : '本周奖金',
				field : 'bonusAmountWTD',
				enableSorting : false,
				width : 120,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.bonusAmountWTD.toFixed(2)}}</div>"
			},
			{
				name : '上次登录时间',
				field : 'lastVisitDate',
				width : 140,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.lastVisitDate | date:'yyyy-MM-dd HH:mm'}}</div>"
			} ],

	statsGridDef : [
			{
				name : '订单编号',
				field : 'trackingId',
				width : 170,
				cellTemplate : '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.viewOrder(row.entity.orderId);">{{row.entity.trackingId}}</a></div>'
			},
			{
				name : '产品名',
				field : 'productDesc',
				width : 300
			},
			{
				name : '购买数量',
				field : 'quantity',
				enableSorting : false,
				width : 70,
				cellTemplate : "<div class='ui-grid-cell-contents' ng-if='row.entity.quantity!=null'>{{row.entity.quantity}}</div><div class='ui-grid-cell-contents' ng-if='row.entity.quantity==null'>N/A</div>"
			},
			{
				name : '购买单价',
				field : 'unitPrice',
				enableSorting : false,
				width : 80,
				cellTemplate : "<div class='ui-grid-cell-contents' ng-if='row.entity.unitPrice!=null'>￥{{row.entity.unitPrice}}</div><div class='ui-grid-cell-contents' ng-if='row.entity.unitPrice==null'>N/A</div>"
			},
			{
				name : '邮费',
				field : 'postFee',
				enableSorting : false,
				width : 50,
				cellTemplate : "<div class='ui-grid-cell-contents'>￥{{row.entity.postFee}}</div>"
			},
			{
				name : '总金额',
				field : 'totalPrice',
				enableSorting : false,
				width : 80,
				cellTemplate : "<div class='ui-grid-cell-contents'>￥{{row.entity.totalPrice}}</div>"
			},
			{
				name : '用户',
				field : 'userName',
				width : 80
			},
			{
				name : '购买时间',
				field : 'orderDate',
				width : 140,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.orderDate | date:'yyyy-MM-dd HH:mm'}}</div>"
			}, {
				name : '打群价分享',
				field : 'userShareCount',
				width : 80,
				cellTemplate : "<div class='ui-grid-cell-contents'>{{row.entity.userShares.length}}</div>"
			}, {
				name : '分享返利',
				field : 'rewardValue',
				width : 100,
				cellTemplate : "<div class='ui-grid-cell-contents'>￥{{row.entity.rewardValue.toFixed(2)}}</div>"
			} ]
}