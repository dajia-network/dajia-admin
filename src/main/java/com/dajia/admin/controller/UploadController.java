package com.dajia.admin.controller;

import com.dajia.repository.PropertyRepo;
import com.dajia.util.ApiUpyunUtils;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.Charset;

@RestController
public class UploadController {
	Logger logger = LoggerFactory.getLogger(UploadController.class);

	@Autowired
	private PropertyRepo propertyRepo;

	@RequestMapping(value = "/upload", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public String handleFileUpload(@RequestParam("file") MultipartFile file) {
		logger.info("REST request to handleFileUpload");
		String filename = ApiUpyunUtils.generateFileName(file.getOriginalFilename());
		String url = ApiUpyunUtils.server_url + ApiUpyunUtils.app_img_folder + filename;
		String displayUrl = ApiUpyunUtils.app_img_domain + filename;
		String username = propertyRepo.findByPropertyKey(ApiUpyunUtils.upyun_username_key).propertyValue;
		String password = propertyRepo.findByPropertyKey(ApiUpyunUtils.upyun_password_key).propertyValue;
		RestTemplate restTemplate = new RestTemplate();
		HttpEntity<byte[]> requestEntity;
		try {
			requestEntity = new HttpEntity<byte[]>(file.getBytes(), createHeaders(username, password));
			restTemplate.exchange(url, HttpMethod.PUT, requestEntity, String.class);
			logger.info("You successfully uploaded " + file.getOriginalFilename() + "!");
			return displayUrl;
		} catch (IOException e) {
			logger.error(e.getMessage());
			logger.info("image uploaded " + file.getOriginalFilename() + " failed !");
		}
		return null;
	}

	private HttpHeaders createHeaders(final String username, final String password) {
		return new HttpHeaders() {
			{
				String auth = username + ":" + password;
				byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(Charset.forName("US-ASCII")));
				String authHeader = "Basic " + new String(encodedAuth);
				set("Authorization", authHeader);
			}
		};
	}
}
