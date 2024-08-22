package kdt.pnu.controller;


import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kdt.pnu.domain.dto.ForumDTO;
import kdt.pnu.service.ForumService;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
public class ForumController {

	private final ForumService forumService;  
	
	// Administration Operation
	@PostMapping("/admin/forum")
	public ResponseEntity<?> adminPage(@RequestParam(required=false) String username,
			@RequestParam(required=false) String region, 
			@RequestParam(required=false) Double elec_diff1, 
			@RequestParam(required=false) Double elec_diff2, 							
			@RequestParam(required=false) String start_date, 
			@RequestParam(required=false) String end_date) {
		System.out.println("===> Forum.searchForum");				
		String elec1 = (elec_diff1 == null? "0" : elec_diff1.toString());
		String elec2 = (elec_diff2 == null? "1000000" : elec_diff2.toString());	   
		start_date = (start_date == null? "19000101" : start_date);
		end_date = (end_date == null? "21000101" : end_date);
		return ResponseEntity
				.ok(forumService.searchForums(username, region, elec1, elec2, start_date, end_date));	    
	}

	//Create and Update
	@PostMapping("members/forum")
	public HashMap<String, Integer> postForum(@RequestBody List<ForumDTO> forumList, @AuthenticationPrincipal User user) {
		System.out.println("===> memberForum");
		return forumService.postForum(forumList, user);
	}

	//Read and Search
	@GetMapping("/members/forum")
	public ResponseEntity<?> searchForum(@AuthenticationPrincipal User user,
			@RequestParam(required=false) String region, 
			@RequestParam(required=false) Double elec_diff1, 
			@RequestParam(required=false) Double elec_diff2, 							
			@RequestParam(required=false) String start_date, 
			@RequestParam(required=false) String end_date) {
		System.out.println("===> Forum.searchForum");	
		String username = user.getUsername();	
		String elec1 = (elec_diff1 == null? "-100000" : elec_diff1.toString());
		String elec2 = (elec_diff2 == null? "1000000" : elec_diff2.toString());	   
		start_date = (start_date == null? "19000101" : start_date);
		end_date = (end_date == null? "21000101" : end_date);
		return ResponseEntity
				.ok(forumService.searchForums(username, region, elec1, elec2, start_date, end_date));
		
	}

	// Delete
	@DeleteMapping("/members/forum/{id}")
	public int deleteById(@PathVariable Integer id) {
		System.out.println("===> Forum.deleteById");
		try {
			forumService.deleteForum(id);
			return 1;
		}
		catch(Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	// Electricity fee 
	@GetMapping("members/forum/fee")
	public HashMap<String, Double> feeCalculator(@RequestParam String date,
								 @RequestParam(required=false) String city, 
								 @RequestParam(required=false) String county,
								 @AuthenticationPrincipal User user) {	
		
		return forumService.fee_calculation(date, city, county, user);
	}
}
