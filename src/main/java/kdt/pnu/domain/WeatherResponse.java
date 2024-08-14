//package kdt.pnu.domain;
//
//import java.util.List;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import lombok.ToString;
//
//@Getter
//@Setter
//@ToString
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class WeatherResponse {
//
//	Response response; 
//	
//	@Getter
//	@Setter
//	@ToString
//	public class Response {
//		
//		private Header header; 
//		private Body body; 
//		
//		@Getter
//		@Setter
//		@ToString
//		public static class Header{ 
//
//			private String resultCode; 			
//			private String resultMsg; 
//		}
//		
//		@Getter
//		@Setter
//		@ToString
//		public static class Body{ 
//
//			private String dataType;				
//			private Items items; 
//			
//			@Getter
//			@Setter
//			@ToString
//			public static class Items {
//				private List<Item> item;
//				
//				@Getter
//				@Setter
//				@ToString
//				public static class Item {
//
//					private String baseDate;						
//					private String baseTime;						
//					private String category;						
//					private int nx;						
//					private int ny;
//					private String obsrValue;
//				}
//			}
//		}
//	}
//
//}