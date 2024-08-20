package kdt.pnu.service;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.transaction.Transactional;
import kdt.pnu.domain.Forum;
import kdt.pnu.domain.dto.ForumDTO;
import kdt.pnu.persistence.ForumRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ForumService {
	private final ForumRepository forumRepo; 
	private final ModelMapper modelMapper; 
	
	
	// Create	
	public void saveForum(Forum forum) {			
		forumRepo.save(forum); 		
		forumRepo.sortForum(forum.getUsername());
	}
	
	//Update
	public void updateForum(Forum updatedforum) {
		Forum forum = forumRepo.findById(updatedforum.getForum_id()).get(); 
		
		if (updatedforum.getDate() != forum.getDate())
			forum.setDate(updatedforum.getDate());
		
		if (updatedforum.getElec_total() != forum.getElec_total())
			forum.setElec_total(updatedforum.getElec_total() );
		
		if (updatedforum.getComment() != forum.getComment())
			forum.setComment(updatedforum.getComment());;
			
			if (updatedforum.getRegion() != forum.getRegion())
				forum.setRegion(updatedforum.getRegion());
			
			forumRepo.save(forum); 		
			forumRepo.sortForum(forum.getUsername());
	}
	
	// Read
//	public List<Forum> getForums(String username) {
//		List<Forum> list = forumRepo.findByUsername(username);
//		list.sort((f1,f2) -> f1.getDate().compareTo(f2.getDate()));
//		return list;
//	}
	
	// Search
	public List<ForumDTO> searchForums(String username, 
									String region,
									String elec_diff1, 
									String elec_diff2, 
									String start_date, 
									String end_date) {
		forumRepo.sortForum(username);
		List<Object[]> list = forumRepo.searchForums(username, 
												 region, 
												 elec_diff1, 
												 elec_diff2, 
												 start_date, 
												 end_date);
		List<ForumDTO> ret = new ArrayList<>(); 
		for (Object[] obj : list) {
			ret.add(ForumDTO.builder()
					.forum_id(Integer.parseInt(obj[0].toString()))
					.date(obj[1].toString())
					.username(obj[2].toString())
					.elec_total(Double.parseDouble(obj[3].toString()))
					.comment(obj[4] != null? obj[4].toString(): "")
					.region(obj[5] != null ? obj[5].toString() : "")
					.elec_diff(Double.parseDouble(obj[6].toString()))
					.days_diff(Integer.parseInt(obj[7].toString()))
					.city(obj[8] != null? obj[8].toString() : "")
					.max_temp(Double.parseDouble(obj[9].toString()))
					.min_temp(Double.parseDouble(obj[10].toString()))
					.avg_temp(Double.parseDouble(obj[11].toString()))
					.max_rh(Double.parseDouble(obj[12].toString()))
					.min_rh(Double.parseDouble(obj[13].toString()))
					.avg_rh(Double.parseDouble(obj[14].toString()))					
					.build());
		}		
		ret.sort((f1,f2) -> f1.getDate().compareTo(f2.getDate()));
		return ret;
	}	
	
	// Delete	
	public void deleteForum(int id) { 
		Forum forum = forumRepo.findById(id).get();
		forumRepo.delete(forum);
		forumRepo.sortForum(forum.getUsername());
	}
	
	@Transactional
	public HashMap<String, Integer> postForum(List<ForumDTO> forumList, User user) {
		HashMap<String, Integer> results = new HashMap<>(); 
		String username = user.getUsername();
		Integer inserted = 0 ; Integer updated = 0 ;
		for (ForumDTO forumDTO : forumList) {
			forumDTO.setUsername(username);
			LocalDate date = LocalDate.now();
			if(forumDTO.getDate() != null)	 
			date = LocalDate.parse(forumDTO.getDate(),
					DateTimeFormatter.ofPattern("yyyy-MM-dd"));		
			Forum forum = modelMapper.map(forumDTO, Forum.class);			
			forum.setDate(date);
			System.out.println(forum.toString());

			if(forum.getForum_id() == null) inserted ++ ; 
			else updated ++;
			forumRepo.save(forum);	
			
		}
		results.put("inserted", inserted); results.put("updated", updated);
		System.out.println("====> HashMap" + results.toString());
		return results;
	}
	
	
	@GetMapping("members/forum/fee") 
	public HashMap<String, Double> fee_calculation(String date,
												   String city,
												   String county, 
												   User user) { 
		String username = user.getUsername(); 	
		System.out.println(city + county);
		HashMap<String, Double> results = new HashMap<>(); 		
		List<Object[]> list = forumRepo.electricity_fee(date, username);
		Double fee = 
				(list.get(0)[0]!=null? Double.parseDouble(list.get(0)[0].toString()): -1);
		Double amount = 
				(list.get(0)[1]!=null? Double.parseDouble(list.get(0)[1].toString()): -1);
		Double prev_fee = 
				(list.get(0)[1]!=null? Double.parseDouble(list.get(0)[2].toString()): -1);
		Double prev_amount = 
				(list.get(0)[1]!=null? Double.parseDouble(list.get(0)[3].toString()): -1);		
		results.put("fee", fee); results.put("sum", amount);
		results.put("prev_fee", prev_fee); results.put("prev_sum", prev_amount);
		
		if (city != null && county != null) {
			List<Object[]> list1 = forumRepo.average_fee(date, city, county);
			Double prev_price_avg = Double.parseDouble(list1.get(0)[0].toString());			
			Double price_avg = Double.parseDouble(list1.get(1)[0].toString());
			results.put("prev_price_avg", prev_price_avg); 
			results.put("price_avg", price_avg);				
		}		
		return results;
	}
	
}




