package kdt.pnu.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kdt.pnu.domain.Members;
import kdt.pnu.service.MembersService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MembersController {
	private final MembersService memService; 
	
	@PostMapping("/signup")
	public String joinMembers(@RequestBody Members member) {
		System.out.println("===-> signup !!!!");
		return memService.joinMembers(member); 
	}
	
	@PostMapping("/members/unsub")
	public String unsubMembers(@AuthenticationPrincipal User user) {
		return memService.unsubMembers(user);
	}
}
