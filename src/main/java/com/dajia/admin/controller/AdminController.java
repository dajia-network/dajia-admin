package com.dajia.admin.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.dajia.domain.Price;
import com.dajia.domain.Product;
import com.dajia.domain.ProductItem;
import com.dajia.domain.ProductTag;
import com.dajia.domain.User;
import com.dajia.domain.UserOrder;
import com.dajia.repository.ProductItemRepo;
import com.dajia.repository.ProductRepo;
import com.dajia.repository.ProductTagRepo;
import com.dajia.repository.UserOrderRepo;
import com.dajia.repository.UserRepo;
import com.dajia.service.ApiService;
import com.dajia.service.ExportService;
import com.dajia.service.OrderService;
import com.dajia.service.ProductService;
import com.dajia.service.RefundService;
import com.dajia.service.SmsService;
import com.dajia.service.StatService;
import com.dajia.service.UserService;
import com.dajia.util.ApiWechatUtils;
import com.dajia.util.CommonUtils;
import com.dajia.util.CommonUtils.OrderStatus;
import com.dajia.util.UserUtils;
import com.dajia.vo.BulkEditVO;
import com.dajia.vo.LoginUserVO;
import com.dajia.vo.OrderFilterVO;
import com.dajia.vo.OrderVO;
import com.dajia.vo.PaginationVO;
import com.dajia.vo.ProductVO;
import com.dajia.vo.SalesVO;

@RestController
public class AdminController {
	Logger logger = LoggerFactory.getLogger(AdminController.class);

	@Autowired
	private ProductRepo productRepo;

	@Autowired
	private ProductItemRepo productItemRepo;

	@Autowired
	private UserOrderRepo orderRepo;

	@Autowired
	private RefundService refundService;

	@Autowired
	private OrderService orderService;

	@Autowired
	private ProductService productService;

	@Autowired
	private UserService userService;

	@Autowired
	private StatService statService;

	@Autowired
	private SmsService smsService;

	@Autowired
	private ProductTagRepo tagRepo;

	@Autowired
	private ApiService apiService;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	EhCacheCacheManager ehcacheManager;

	@RequestMapping("/admin/robotorder/{pid}")
	public @ResponseBody UserOrder robotOrder(@PathVariable("pid") Long pid) {
		UserOrder order = orderService.generateRobotOrder(pid, 1);
		return order;
	}

	@RequestMapping("/admin/sync")
	public @ResponseBody Map<String, String> syncAllProducts() {
		productService.syncProductsAll();
		Map<String, String> map = new HashMap<String, String>();
		map.put("result", "success");
		return map;
	}

	@RequestMapping(value = "/admin/products/{page}", method = RequestMethod.POST)
	public PaginationVO<ProductItem> productsByPage(@PathVariable("page") Integer pageNum,
			@RequestBody Map<String, String> keyMap) {
		Page<ProductItem> products = null;
		String keyword = keyMap.get("value");
		if (null != keyword && keyword.trim().length() > 0) {
			products = productService.loadProductsByKeywordByPage(keyword, pageNum);
		} else {
			products = productService.loadProductsByPage(pageNum);
		}
		productService.getRealSold(products);
		PaginationVO<ProductItem> page = CommonUtils.generatePaginationVO(products, pageNum);
		return page;
	}

	@RequestMapping("/admin/product/{pid}")
	public ProductVO product(@PathVariable("pid") Long pid) {
		ProductVO product = productService.loadProductDetail(pid);
		if (null == product) {
			product = new ProductVO();
			product.productId = 0L;
			product.productItemId = 0L;
		}
		return product;
	}

	@RequestMapping("/admin/product/remove/{pid}")
	public Product removeProduct(@PathVariable("pid") Long pid) {
		Product product = productRepo.findOne(pid);
		if (null != product) {
			product.isActive = CommonUtils.ActiveStatus.NO.toString();
			if (null != product.productItems)
				for (ProductItem pi : product.productItems) {
					pi.isActive = CommonUtils.ActiveStatus.NO.toString();
				}
			productRepo.save(product);
		}
		return product;
	}

	@RequestMapping(value = "/admin/product/{pid}", method = RequestMethod.POST)
	public @ResponseBody ProductVO modifyProduct(@PathVariable("pid") Long pid, @RequestBody ProductVO productVO) {

		if (null == pid || null == productVO) {
			logger.error("modify product failed, pid or productVo is null");
			return null;
		}

		if (pid.equals(productVO.productId)) {
			Product product = null;
			if (pid.longValue() != 0L) {
				product = productRepo.findOne(pid);
				if (null != product.productItems && product.productItems.size() > 0) {
					for (ProductItem pi : product.productItems) {
						if (pi.isActive.equalsIgnoreCase(CommonUtils.ActiveStatus.YES.toString())) {
							CommonUtils.updateProductItemWithReq(pi, productVO);
							break;
						}
					}
					CommonUtils.updateProductWithReq(product, productVO);
					productRepo.save(product);
					return productService.convertProductVO(product, null);
				}
			} else {
				product = new Product();
			}

			CommonUtils.updateProductWithReq(product, productVO);
			// productRepo.save(product);

			ProductItem productItem = new ProductItem();
			CommonUtils.updateProductItemWithReq(productItem, productVO);
			productItem.product = product;
			product.productItems = new ArrayList<ProductItem>();
			product.productItems.add(productItem);
			productRepo.save(product);
			return productService.convertProductVO(product, null);
		} else {
			logger.error("modify product failed, pid != productVO.productId");
			return null;
		}
	}

	@RequestMapping("/admin/product/{pid}/republish")
	public ProductVO productRepublish(@PathVariable("pid") Long pid) {
		ProductVO pv = productService.loadProductDetail(pid);
		if (null == pv) {
			pv = new ProductVO();
			pv.productId = 0L;
			pv.productItemId = 0L;
		}
		if (pv.productStatus == CommonUtils.ProductStatus.EXPIRED.getKey()) {
			pv.productItemId = 0L;
			productService.republishProduct(pid);
		}
		return pv;
	}

	@RequestMapping("/admin/users/{page}")
	public PaginationVO<User> usersByPage(@PathVariable("page") Integer pageNum) {
		Page<User> users = userService.loadUsersByPage(pageNum);
		PaginationVO<User> page = CommonUtils.generatePaginationVO(users, pageNum);
		return page;
	}

	@RequestMapping("/admin/sales/{page}")
	public PaginationVO<SalesVO> salesByPage(@PathVariable("page") Integer pageNum) {
		Page<User> users = userService.loadSalesUsersByPage(pageNum);
		List<SalesVO> salesList = new ArrayList<SalesVO>();
		for (User user : users) {
			SalesVO sales = userService.generateSalesVO(user);
			salesList.add(sales);
		}
		PaginationVO<SalesVO> page = CommonUtils.generatePaginationVO(users, pageNum);
		page.results = salesList;
		return page;
	}

	@RequestMapping(value = "/admin/users/{page}", method = RequestMethod.POST)
	public PaginationVO<User> usersByKeywordByPage(@PathVariable("page") Integer pageNum,
			@RequestBody Map<String, String> keyMap) {
		Page<User> users = null;
		String keyword = keyMap.get("value");
		if (null != keyword && keyword.trim().length() > 0) {
			users = userService.loadUsersByKeywordByPage(keyword, pageNum);
		} else {
			users = userService.loadUsersByPage(pageNum);
		}
		PaginationVO<User> page = CommonUtils.generatePaginationVO(users, pageNum);
		return page;
	}

	@RequestMapping("/admin/user/{userId}")
	public LoginUserVO userByUserId(@PathVariable("userId") Long userId) {
		LoginUserVO userVO = userService.getUserVO(userId);
		return userVO;
	}

	@RequestMapping("/admin/salesdetail/{userId}")
	public SalesVO salesByUserId(@PathVariable("userId") Long userId) {
		SalesVO salesVO = userService.getSalesVO(userId);
		return salesVO;
	}

	@RequestMapping(value = "/admin/user/{userId}", method = RequestMethod.POST)
	public void modifyUser(@PathVariable("userId") Long userId, @RequestBody LoginUserVO userVO) {
		userService.modifyUser(userId, userVO);
	}

	@RequestMapping(value = "/admin/orders/{page}", method = RequestMethod.POST)
	public PaginationVO<OrderVO> ordersByPage(@PathVariable("page") Integer pageNum, HttpServletRequest request,
			@RequestBody OrderFilterVO orderFilter) {
		Page<UserOrder> orders = orderService.loadOrdersByPage(pageNum, orderFilter);
		List<OrderVO> orderVoList = new ArrayList<OrderVO>();
		for (UserOrder order : orders) {
			OrderVO ov = orderService.convertOrderVO(order);
			orderService.fillOrderVO(ov, order);
			orderVoList.add(ov);
		}
		PaginationVO<OrderVO> page = CommonUtils.generatePaginationVO(orders, pageNum);
		page.results = orderVoList;
		return page;
	}

	@RequestMapping("/admin/order/{orderId}")
	public OrderVO order(@PathVariable("orderId") Long orderId) {
		UserOrder order = orderRepo.findOne(orderId);
		if (null == order) {
			return null;
		}
		OrderVO ov = orderService.convertOrderVO(order);
		orderService.fillOrderVO(ov, order);
		if (null == order.productItemId) {
			ov.productVOList = productService.loadProducts4Order(order.orderItems);
		}
		ov.refundList = refundService.getRefundListByOrderId(orderId);
		return ov;
	}

	@RequestMapping("/admin/order/{orderId}/deliver")
	public UserOrder deliverOrder(@PathVariable("orderId") Long orderId, HttpServletRequest request) throws IOException {
		String logisticTrackingId = request.getParameter("lti");
		String logisticAgent = request.getParameter("la");
		UserOrder order = orderRepo.findOne(orderId);
		order.orderStatus = OrderStatus.DELEVERING.getKey();
		order.logisticAgent = logisticAgent;
		order.logisticTrackingId = logisticTrackingId;
		orderRepo.save(order);

		// 微信公众号发送购买成功通知
		User user = userRepo.findByUserId(order.userId);
		if (null != user) {
			apiService.sendWechatTemplateMsg(ApiWechatUtils.wechat_msg_template_order_delivering, user.oauthUserId,
					order.trackingId);
		}
		return order;
	}

	@RequestMapping("/admin/order/{orderId}/comments")
	public UserOrder addComments(@PathVariable("orderId") Long orderId, HttpServletRequest request) {
		String comments = request.getParameter("comments");
		String adminComments = request.getParameter("adminComments");
		UserOrder order = orderRepo.findOne(orderId);
		order.comments = comments;
		order.adminComments = adminComments;
		orderRepo.save(order);
		return order;
	}

	@RequestMapping("/admin/order/{orderId}/finish")
	public UserOrder finishOrder(@PathVariable("orderId") Long orderId) {
		UserOrder order = orderRepo.findOne(orderId);
		order.orderStatus = OrderStatus.DELEVRIED.getKey();
		orderRepo.save(order);
		return order;
	}

	@RequestMapping("/admin/order/{orderId}/close")
	public UserOrder closeOrder(@PathVariable("orderId") Long orderId) {
		UserOrder order = orderRepo.findOne(orderId);
		order.orderStatus = OrderStatus.CLOSED.getKey();
		orderRepo.save(order);
		return order;
	}

	@RequestMapping("/admin/order/{orderId}/reopen")
	public UserOrder reopenOrder(@PathVariable("orderId") Long orderId) {
		UserOrder order = orderRepo.findOne(orderId);
		if (null != order.logisticTrackingId) {
			order.orderStatus = OrderStatus.DELEVERING.getKey();
		} else {
			order.orderStatus = OrderStatus.PAIED.getKey();
		}
		orderRepo.save(order);
		return order;
	}

	@RequestMapping(value = "/admin/stats/{page}", method = RequestMethod.GET)
	public PaginationVO<OrderVO> statsByPage(@PathVariable("page") Integer pageNum) {
		return statService.getRewardStatsByPage(pageNum);
	}

	@RequestMapping(value = "/admin/preference/changePassword", method = RequestMethod.POST)
	public void changeAdminPassword(@RequestParam(value = "currentPassword", required = false) String currentPassword,
			@RequestParam(value = "newPassword", required = false) String newPassword, HttpServletRequest request,
			HttpServletResponse response) throws IOException {

		logger.info("admin change password, currentPass is {}, newPass is {}", currentPassword, newPassword);
		LoginUserVO loginUserVO = (LoginUserVO) request.getSession(true).getAttribute(UserUtils.session_user);
		if (null == loginUserVO) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		Long userId = loginUserVO.userId;
		boolean result = userService.updateUserPassword(userId, currentPassword, newPassword);

		if (result) {
			response.sendRedirect("/admin/index.html#/preference/changePasswordSuccess");
		} else {
			response.sendRedirect("/admin/index.html#/preference/changePasswordFail");
		}
	}

	protected User getLoginUser(HttpServletRequest request, HttpServletResponse response, UserRepo userRepo,
			boolean returnFailCode) {
		User user = null;
		HttpSession session = request.getSession(true);
		LoginUserVO loginUser = (LoginUserVO) session.getAttribute(UserUtils.session_user);
		if (null != loginUser) {
			if (null != loginUser.userId) {
				user = userRepo.findByUserId(loginUser.userId);
			} else {
				user = userRepo.findByOauthUserIdAndOauthType(loginUser.oauthUserId, loginUser.oauthType);
			}
		}
		if (null == user && returnFailCode) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return null;
		}
		return user;
	}

	@RequestMapping("/admin/tags")
	public List<ProductTag> productTags() {
		return tagRepo.findByIsActive(CommonUtils.Y);
	}

	@RequestMapping("/admin/bulkEdit/product")
	public @ResponseBody Map<String, String> bulkEditProduct(@RequestBody BulkEditVO<ProductVO> bulkEdit)
			throws IOException {
		List<Long> productIds = bulkEdit.idList;
		ProductVO productDetail = bulkEdit.entity;
		productService.bulkUpdateProduct(productIds, productDetail);
		Map<String, String> map = new HashMap<String, String>();
		map.put("result", "success");
		return map;
	}

	@RequestMapping("/admin/export/{resource}")
	public ModelAndView getExcel(@PathVariable("resource") String resource, HttpServletRequest request,
			HttpServletResponse response) {
		if (null == resource) {
			return null;
		}
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("resource", resource);
		
		long currentTime = System.currentTimeMillis();
		if (resource.equalsIgnoreCase("order")) {
			long currentTimeInner = System.currentTimeMillis();
			List<UserOrder> orders = orderService.loadAllValidOrders();
			logger.info("1.1 loadAllValidOrders: " + (System.currentTimeMillis() - currentTimeInner) +" ms");
			currentTimeInner = System.currentTimeMillis();
			List<OrderVO> ovList = new ArrayList<>();
			for (UserOrder order : orders) {
				OrderVO ov = orderService.convertOrderVO(order);
				orderService.fillOrderVO(ov, order);
				ovList.add(ov);
			}
			logger.info("1.2 convertOrderVO: " + (System.currentTimeMillis() - currentTimeInner) +" ms");
			model.put("data", ovList);
			response.setContentType("application/vnd.ms-excel");
			response.setHeader("Content-Disposition", "attachment; filename=orders.xls; charset=UTF-8");
		}
		logger.info("1 get OrderVOList: " + (System.currentTimeMillis() - currentTime) +" ms");
		currentTime = System.currentTimeMillis();
		
		ModelAndView mv = new ModelAndView(new ExportService(), model);
		logger.info("2 generate Excel: " + (System.currentTimeMillis() - currentTime) +" ms");
		return mv;
	}
	/*
	 * @RequestMapping(value = "/smslogin", method = RequestMethod.POST) public
	 * 
	 * @ResponseBody LoginUserVO userSmsLogin(@RequestBody LoginUserVO
	 * loginUser, HttpServletRequest request, HttpServletResponse response) { if
	 * (null !=
	 * ehcacheManager.getCacheManager().getCache(CommonUtils.cache_name_signin_code
	 * )) { Cache cache =
	 * ehcacheManager.getCacheManager().getCache(CommonUtils.cache_name_signin_code
	 * ); String signinCode =
	 * cache.get(loginUser.mobile).getObjectValue().toString();
	 * logger.info(signinCode); if (null == signinCode ||
	 * !signinCode.equals(loginUser.signinCode)) { return null; }
	 * loginUser.loginIP = CommonUtils.getRequestIP(request);
	 * loginUser.loginDate = new Date();
	 * 
	 * User user = userService.userLogin(loginUser.mobile, loginUser.password,
	 * request, true); loginUser = UserUtils.addLoginSession(loginUser, user,
	 * request);
	 * 
	 * return loginUser; } else { return null; } }
	 * 
	 * @RequestMapping("/signupCheck/{mobile}") public @ResponseBody ReturnVO
	 * signupCheck(@PathVariable("mobile") String mobile) { String result =
	 * userService.checkMobile(mobile); ReturnVO rv = new ReturnVO(); rv.result
	 * = result; return rv; }
	 * 
	 * @RequestMapping("/signinSms/{mobile}") public @ResponseBody ReturnVO
	 * signinSms(@PathVariable("mobile") String mobile) { String result =
	 * smsService.sendSigninMessage(mobile, true); ReturnVO rv = new ReturnVO();
	 * rv.result = result; return rv; }
	 */
}
