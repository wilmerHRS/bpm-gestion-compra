[condition][]Existe una solicitud de compra pendiente=s : Solicitud( ruta == "PENDIENTE" )
[condition][]- con datos incompletos=( productoId == null || productoId <= 0 || cantidad == null || cantidad <= 0 || motivo == null || motivo.trim().isEmpty() )
[condition][]- cuyo producto existe en el catalogo=encontrado == true
[condition][]- cuya cantidad supera el stock disponible=stock != null, cantidad > stock
[consequence][]Rechazar la solicitud indicando "{mensaje}"=modify( s ) \{ setRuta( "RECHAZAR" ), setResultado( "RECHAZADA" ), setDetalle( "{mensaje}" ) \}
