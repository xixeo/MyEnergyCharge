package kdt.pnu.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherResponse {

	Response response; 
	
	@Getter
	@Setter
	@ToString
	public class Response {
		
		@JsonProperty("header")
		private Header header; 
		@JsonProperty("body")
		private Body body; 
		
		@Getter
		@Setter
		@ToString
		public static class Header{ 
			
			@JsonProperty("resultCode")
			private String resultCode; 		
			@JsonProperty("resultMsg")
			private String resultMsg; 
		}
		
		@Getter
		@Setter
		@ToString
		public static class Body{ 

			@JsonProperty("dataType")
			private String dataType;
			@JsonProperty("items")
			private Items items; 
			
			@Getter
			@Setter
			@ToString
			public static class Items {
				
				@JsonProperty("item")
				private List<Item> item;
				
				@Getter
				@Setter
				@ToString
				public static class Item {

					@JsonProperty("baseDate")					
					private String baseDate;	
					@JsonProperty("baseTime")
					private String baseTime;
					@JsonProperty("category")
					private String category;	
					@JsonProperty("nx")					
					private int nx;		
					@JsonProperty("ny")
					private int ny;
					@JsonProperty("obsrValue")
					private String obsrValue;
				}
			}
		}
	}

}