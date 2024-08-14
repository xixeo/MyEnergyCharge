package kdt.pnu.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import jakarta.servlet.http.HttpServletRequest;
import kdt.pnu.domain.Forum;
import kdt.pnu.service.ForumService;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
public class ForumController {

	private final ForumService forumService;  

	@PostMapping("/members")
	public void forumEntry() {
		System.out.println("===> hello member!!");
	}

	@PostMapping("/admin")
	public void adminEntry() { 
		System.out.println("===> hello admin");
	}

	@PostMapping("/admin/forum")
	public ResponseEntity<?> adminPage(@RequestParam(required=false) String username,
			@RequestParam(required=false) String region, 
			@RequestParam(required=false) Double elec_diff1, 
			@RequestParam(required=false) Double elec_diff2, 							
			@RequestParam(required=false) String start_date, 
			@RequestParam(required=false) String end_date) {
		System.out.println("===> Forum.searchForum");				
		//		username = (username == null? "%%" : username);
		//		region = (region == null? "%%" : region);
		String elec1 = (elec_diff1 == null? "0" : elec_diff1.toString());
		String elec2 = (elec_diff2 == null? "1000000" : elec_diff2.toString());	   
		start_date = (start_date == null? "19000101" : start_date);
		end_date = (end_date == null? "21000101" : end_date);
		return ResponseEntity
				.ok(forumService.searchForums(username, region, elec1, elec2, start_date, end_date));	    
	}

	// Create 
	//	@PostMapping("/members/forum")
	//	public int postForum(@RequestBody Forum forum, HttpServletRequest request) {
	//		try { 
	//			String jwtToken = request.getHeader("Authorization").replace("Bearer ", "");
	//			String username = JWT.require(Algorithm.HMAC256("edu.pnu.jwt")).build().verify(jwtToken)
	//					.getClaim("username").asString(); 
	//			forum.setUsername(username);
	//			forumService.saveForum(forum);
	//			System.out.println("===>saveForum");
	//			return 1; 
	//		} catch(Exception e) {
	//			e.printStackTrace(); 
	//			return 0; 
	//		}
	//	}		

	//Trying to combine create and update from users (not admin)
	@PostMapping("/members/forum")
	public int postForum(@RequestBody List<ForumDTO> forumList, HttpServletRequest request) {
		try { 
			String jwtToken = request.getHeader("Authorization").replace("Bearer ", "");
			String username = JWT.require(Algorithm.HMAC256("edu.pnu.jwt")).build().verify(jwtToken)
					.getClaim("username").asString();			
			for (Forum forum : forumList) {
				forum.setUsername(username);					

				if (forum.getForum_id() == null) {			
					forumService.saveForum(forum);
					System.out.println("===>saveForum");
				}
				else {
					forumService.updateForum(forum);
					System.out.println("===>updateForum"); 
				}
			}
			return 1;
		} catch(Exception e) {
			e.printStackTrace(); 
			return 0; 
		}
	}		


	//	@GetMapping("/members/forum")
	//	public ResponseEntity<?> findByUsername(@RequestParam String username) {
	//		System.out.println("===> Forum.findByUsername");
	//		
	//		return ResponseEntity.ok(forumService.getForums(username)); 
	//	}	

	//username 추출하기 	
	//	@GetMapping("/members/forum")
	//	public ResponseEntity<?> findByUsername(HttpServletRequest request) {
	//		System.out.println("===> Forum.findByUsername");
	//		String jwtToken = request.getHeader("Authorization").replace("Bearer ", "");
	//		String username = JWT.require(Algorithm.HMAC256("edu.pnu.jwt")).build().verify(jwtToken)
	//							.getClaim("username").asString(); 				
	//		return ResponseEntity.ok(forumService.getForums(username)); 
	//	}

	//	@GetMapping("/members/forum/search")
	//	public ResponseEntity<?> searchForum(@RequestParam String username,
	//							@RequestParam(required=false) String region, 
	//							@RequestParam(required=false) Double elec_diff1, 
	//							@RequestParam(required=false) Double elec_diff2, 							
	//							@RequestParam(required=false) String start_date, 
	//							@RequestParam(required=false) String end_date) {
	//		System.out.println("===> Forum.searchForum");		
	//		region = (region == null? "%%" : region);
	//	    String elec1 = (elec_diff1 == null? "0" : elec_diff1.toString());
	//	    String elec2 = (elec_diff2 == null? "1000000" : elec_diff2.toString());	   
	//	    start_date = (start_date == null? "19000101" : start_date);
	//	    end_date = (end_date == null? "21000101" : end_date);
	//	    return ResponseEntity
	//	    		.ok(forumService.searchForums(username, region, elec1, elec2, start_date, end_date));	    
	//	}

	//username 추출하기
	@GetMapping("/members/forum")
	public ResponseEntity<?> searchForum(HttpServletRequest request,
			@RequestParam(required=false) String region, 
			@RequestParam(required=false) Double elec_diff1, 
			@RequestParam(required=false) Double elec_diff2, 							
			@RequestParam(required=false) String start_date, 
			@RequestParam(required=false) String end_date) {
		System.out.println("===> Forum.searchForum");		
		String jwtToken = request.getHeader("Authorization").replace("Bearer ", "");
		String username = JWT.require(Algorithm.HMAC256("edu.pnu.jwt")).build().verify(jwtToken)
				.getClaim("username").asString(); 		
		//		region = (region == null? "%%" : region);
		String elec1 = (elec_diff1 == null? "-100000" : elec_diff1.toString());
		String elec2 = (elec_diff2 == null? "1000000" : elec_diff2.toString());	   
		start_date = (start_date == null? "19000101" : start_date);
		end_date = (end_date == null? "21000101" : end_date);
		return ResponseEntity
				.ok(forumService.searchForums(username, region, elec1, elec2, start_date, end_date));	    
	}

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

//	@PutMapping("/members/forum/{id}")
//	public int updatedByForum(@RequestBody Forum forum, @PathVariable int id) { 
//		System.out.println("===> Forum.updateByForum");
//		try{ 
//			forumService.updateForum(forum);
//			return 1; 
//		} catch(Exception e) {
//			e.printStackTrace();
//			return 0;			
//		}
//	}

}
