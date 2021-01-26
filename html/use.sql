select t1.*, t2.category1, t2.category2, t2.category3, t3.path
 from t_product t1, t_category t2, t_image t3
where t1.category_id = t2.id and t1.id = t3.product_id and t3.type=1
  
select t1.*, t2.category1, t2.category2, t2.category3, t3.path
 from t_product t1, t_category t2, t_image t3
where t1.category_id = t2.id and t1.id = t3.product_id and t3.type=3 and t1.id=1
  
select * from t_image where product_id = 1 and type=2

insert into t_product ( product_name , product_price, delivery_price, add_delivery_price, tags, outbound_days, seller_id, category_id) 
values ('테스트제품','50000','2500','5000','테스트',5 , 1, 1)