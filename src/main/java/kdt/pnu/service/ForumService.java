package kdt.pnu.service;


import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

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
	public List<Forum> getForums(String username) {
		List<Forum> list = forumRepo.findByUsername(username);
		list.sort((f1,f2) -> f1.getDate().compareTo(f2.getDate()));
		return list;
	}
	
	// Search
	public List<ForumDTO> searchForums(String username, 
									String region,
									String elec_diff1, 
									String elec_diff2, 
									String start_date, 
									String end_date) {
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
			Forum forum = modelMapper.map(forumDTO, Forum.class);
			System.out.println(forum.toString());
			if(forum.getDate() == null) forum.setDate(new Date());	
			if(forum.getForum_id() == null) inserted ++ ; 
			else updated ++;
			forumRepo.save(forum);				
		}
		results.put("inserted", inserted); results.put("updated", updated);
		System.out.println("====> HashMap" + results.toString());
		return results;
	}
	
	
	
	
}
