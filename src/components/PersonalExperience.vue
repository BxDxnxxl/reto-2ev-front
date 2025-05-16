<template>
    <div class="experience">
        <h3>Mi experiencia personal</h3>
        <p>
            Red Dead Redemption 2 fue uno de los juegos más inmersivos que he jugado. Desde su impresionante mundo
            abierto,
            con paisajes que van desde bosques frondosos hasta llanuras interminables, hasta los pequeños detalles en
            cada
            personaje y su interacción. El nivel de detalle en el mundo es asombroso, con animales que siguen su propio
            comportamiento y personas que tienen rutinas diarias.
            <br>
            <br>
            Las misiones del juego, tanto principales como secundarias, son variadas y siempre ofrecen una sensación de
            propósito,
            con historias profundas y personajes que te hacen sentirte parte del mundo. Pasé horas simplemente
            cabalgando y explorando,
            disfrutando de la naturaleza, la música, que se adapta perfectamente a cada momento, y los encuentros
            aleatorios, como rescatar
            viajeros o descubrir eventos inesperados.
            <br>
            <br>
            La jugabilidad es fluida y ofrece una amplia gama de actividades, desde tiroteos intensos hasta
            interacciones más suaves como
            pescar o jugar al póker. La sensación de estar viviendo una historia dentro de un mundo vibrante y lleno de
            vida es algo que pocos
            juegos logran alcanzar.
        </p>
    </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.experience {
    background: $secondary-color;
    color: $text-color;
    padding: $spacing-medium;
    border-radius: $border-radius;
    margin-bottom: $spacing-large;
    box-shadow: $box-shadow;

    h3 {
        color: $primary-color;
        font-size: $font-size-xlarge;
    }

    p {
        font-size: $font-size-base;
        line-height: 1.6;
    }
}
</style>