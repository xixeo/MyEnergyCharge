package kdt.pnu.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import kdt.pnu.domain.Forum;

public interface ForumRepository extends JpaRepository<Forum, Integer>{

	public List<Forum> findByUsername(String username);
	
	@Modifying
	@Transactional
	@Query(value= "update forum as current "
			+ "join( "
			+ "	select  "
			+ "			f.username,  "
			+ "			f.elec_total,  "
			+ "			f.date,  "
			+ "			f.elec_diff,  "
			+ "			f.days_diff,  "
			+ "			lag(f.elec_total) over (partition by f.username order by f.date) as prev_elec_total,   "
			+ "			lag(f.date) over (partition by f.username order by f.date) as prev_date "
			+ "		from forum as f where username= :username "
			+ "	) as prev on prev.username= current.username and current.date = prev.date "
			+ "set  "
			+ "	current.elec_diff = coalesce(current.elec_total - prev.prev_elec_total, 0), "
			+ " current.days_diff = coalesce(datediff(current.date , prev.prev_date), 0);   "
			, nativeQuery = true)
	void sortForum(@Param("username") String username);
	
	
	@Query(value="select  "
			+ "	f.*, "
			+ "    weather_data.max_temp,  "
			+ "    weather_data.min_temp,  "
			+ "    weather_data.avg_temp,  "
			+ "    weather_data.max_rh,  "
			+ "    weather_data.min_rh,  "
			+ "    weather_data.avg_rh "
			+ "from forum f "
			+ "left join (  "
			+ "	select  "
			+ "		w.date as w_date, "
			+ "		format(max(w.tmpr),1) as max_temp,  "
			+ "        format(min(w.tmpr),1) as min_temp,  "
			+ "        format(avg(w.tmpr),1) as avg_temp,  "
			+ "        format(max(w.rhwt),1) as max_rh,  "
			+ "        format(min(w.rhwt),1) as min_rh,  "
			+ "        format(avg(w.rhwt),1) as avg_rh "
			+ "	from weather w  "
			+ "    group by w_date "
			+ ") as weather_data  "
			+ "on date(f.date) = date(weather_data.w_date) "			
			+ "where (:username is null or username = :username) "
			+ "and ( :region is null or region like :region ) "
			+ "and ( elec_diff between :elec_diff1 and :elec_diff2 ) "
			+ "and date between :start_date and :end_date;  "
			, nativeQuery = true)
	List<Object[]> searchForums(@Param("username") String username,
							@Param("region") String region, 
							@Param("elec_diff1") String elec_diff1,
							@Param("elec_diff2") String elec_diff2,
							@Param("start_date") String start_date, 
							@Param("end_date") String end_date);
	
	
//	@Query(value = "select *, ", nativeQuery = true)
//	List<Object[]> combineWeatherData(@Param("date") String date);
	
}
