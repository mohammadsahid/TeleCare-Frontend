const getMyReservations =
async(req,res)=>{

 const reservations =
 await Reservation.find({

 patient:
 req.user._id

 })

 .populate(
 "medicine",
 "name"
 )

 .populate(
 "pharmacy",
 "name"
 );

 res.json({
 success:true,
 reservations,
 });

};