package kdt.pnu.controller;

import org.springframework.web.bind.annotation.RestController;

import kdt.pnu.service.MembersService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MembersController {
	private final MembersService memService; 
	
//	@GetMapping("/member")
	
}
