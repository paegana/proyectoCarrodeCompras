$(document).ready(function() {
    const envioFijo = 5000;
    let envio = 0; // Empieza en 0 cuando no hay productos
    let descuentoAplicado = false;
  
    // Actualizar el resumen del carrito cuando cambian las cantidades
    function actualizarResumen() {
      let total = 0;
      let articulos = 0;
  
      $(".item").each(function() {
        const cantidad = $(this).find(".cantidad").val();
        const precioUnitario = $(this).data("price");
        const subtotal = cantidad * precioUnitario;
  
        $(this).find(".precio-item").text(`$${subtotal.toLocaleString()}`);
        total += subtotal;
        articulos += parseInt(cantidad);
      });
  
      // Actualizar envío solo si hay artículos
      envio = articulos > 0 ? envioFijo : 0;
  
      $("#articulos").text(`${articulos} artículos`);
      let totalFinal = total + envio;
      $("#precio-total").text(`$${totalFinal.toLocaleString()}`);
      $("#articulos").next().text(`$${total.toLocaleString()}`);
      $("#envio").text(`Envío <span>$${envio.toLocaleString()}</span>`);
  
      return totalFinal;
    }
  
    // Actualizar el detalle de la boleta
    function actualizarBoleta() {
      let detalle = "";
      $(".item").each(function() {
        const producto = $(this).data("producto");
        const cantidad = $(this).find(".cantidad").val();
        const precio = $(this).find(".precio-item").text();
        if (cantidad > 0) {
          detalle += `<p>${producto} x${cantidad}: ${precio}</p>`;
        }
      });
      $("#detalle-boleta").html(detalle);
    }
  
    // Evento para actualizar cuando se cambian las cantidades
    $(".cantidad").on('input', function() {
      actualizarResumen();
      actualizarBoleta();
    });
  
    // Aplicar descuento
    $("#aplicar-descuento").click(function() {
      if (descuentoAplicado) {
        alert("Ya se ha aplicado un descuento. No puedes aplicar otro.");
        return;
      }
  
      let codigo = $("#codigo-descuento").val();
      let totalActual = actualizarResumen();
  
      if (codigo === "JQUERY2222") {
        const descuento = 12000; // Monto de descuento
        let totalConDescuento = totalActual - descuento;
        $("#estado-descuento").text("¡Descuento aplicado!").css("color", "green");
        $("#precio-total").text(`$${totalConDescuento.toLocaleString()}`);
        descuentoAplicado = true;
        $("#detalle-boleta").append(`<p>Descuento aplicado: -$${descuento.toLocaleString()}</p>`);
      } else {
        $("#estado-descuento").text("Código inválido").css("color", "red");
      }
    });
  
    // Función para limpiar el carrito
    $(".limpiar-carrito").click(function() {
      // Reiniciar las cantidades
      $(".cantidad").val(0); // Empezar en 0
      // Reiniciar el precio total y resumen
      actualizarResumen();
      actualizarBoleta();
      $("#codigo-descuento").val('');
      $("#estado-descuento").text('');
      $("#precio-total").text("$0");
      $(".realizar-compra").text("Realizar Compra").css({
        "background-color": "#ff5252",
        "border": "none"
      });
      $("#detalle-boleta").empty();
      descuentoAplicado = false;
      envio = 0; // Restablecemos el envío
  
      // Ocultar la boleta al limpiar el carrito
      $(".boleta").removeClass('mostrar').hide();
    });
  
    // Evento para realizar la compra
    $(".realizar-compra").click(function() {
      const totalCompra = actualizarResumen();
      if (totalCompra === 0) {
        alert("No has seleccionado productos.");
        return;
      }
  
      $(this).text("¡Compra Realizada!").css({
        "background-color": "#4CAF50",
        "border": "1px solid #388E3C"
      });
  
      // Mostrar el detalle final de la compra en la boleta
      let detalleFinal = "";
      $(".item").each(function() {
        const producto = $(this).data("producto");
        const cantidad = $(this).find(".cantidad").val();
        const precio = $(this).find(".precio-item").text();
        if (cantidad > 0) {
          detalleFinal += `<p>${producto} x${cantidad}: ${precio}</p>`;
        }
      });
  
      // Añadir el costo del envío y el descuento si fue aplicado
      detalleFinal += `<p>Envío: $${envio.toLocaleString()}</p>`;
      if (descuentoAplicado) {
        detalleFinal += `<p>Descuento aplicado: -$12.000</p>`;
      }
  
      detalleFinal += `<p><strong>Total Final: $${totalCompra.toLocaleString()}</strong></p>`;
  
      // Mostrar el detalle final en la sección de boleta
      $("#detalle-boleta").html(detalleFinal);
  
      // Mostrar la boleta
      $(".boleta").addClass('mostrar').fadeIn();
    });
  
    // Iniciar con valores actualizados (carrito vacío)
    actualizarResumen();
    actualizarBoleta();
  });
  