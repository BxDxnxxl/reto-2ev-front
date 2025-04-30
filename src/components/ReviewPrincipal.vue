<template>
    <div class="container">
        <div class="title">
            <h1>Red Dead Redemption 2</h1>
            <div class="nav">
                <a href="https://www.rockstargames.com/reddeadredemption2/">Sitio oficial</a>
                <a href="https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/">Steam</a>
                <a href="https://www.metacritic.com/game/red-dead-redemption-2/">Metacritic</a>
                <a href="#">Salir</a>
            </div>
        </div>

        <div class="box">

            <div class="about">
                <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg" class="image"
                    alt="Imagen del videojuego" />

                <div class="text-content">
                    <p><b>SINOPSIS</b></p>
                    <p>Red Dead Redemption 2 es una épica historia de honor, lealtad y supervivencia ambientada en los
                        últimos días del Viejo Oeste, justo antes del amanecer del siglo XX. Desarrollado por Rockstar
                        Games, el juego sigue a <strong>Arthur Morgan</strong>, un forajido miembro de la banda de <strong>Dutch Van der Linde</strong>,
                        un grupo de forajidos que lucha por sobrevivir en un mundo que rápidamente está siendo
                        arrastrado por la civilización y el orden establecido.</p>

                    <p>A medida que el gobierno y las fuerzas de la ley se expanden por todo el territorio, Arthur y su
                        banda se enfrentan a desafíos cada vez mayores, luchando no solo contra las autoridades, sino
                        también contra sus propios dilemas morales y las tensiones internas dentro de la banda. La
                        historia explora el conflicto interno de Arthur mientras se debate entre su lealtad a Dutch y
                        sus propias dudas sobre el estilo de vida que llevan.</p>

                    <p>El juego no solo se centra en la narrativa principal, sino que también ofrece una gran variedad
                        de misiones secundarias que enriquecen la experiencia. Los jugadores pueden interactuar con un
                        sinfín de personajes, explorar vastos paisajes y participar en actividades como cazar, pescar,
                        jugar al póker o simplemente disfrutar del paisaje. El mundo de <strong>Red Dead Redemption 2</strong> es
                        expansivo y detallado, con un ciclo de vida que se siente auténtico, desde los animales que
                        habitan el entorno hasta las interacciones entre los personajes.</p>

                    <p>La jugabilidad es profunda y variada, con un enfoque en la exploración y el combate, pero también
                        en las relaciones personales y la moralidad. Las decisiones que tomes afectan el mundo a tu
                        alrededor, alterando la forma en que los demás personajes te ven y cómo se desarrollan ciertas
                        misiones. En cada rincón del mapa hay algo que descubrir, haciendo que cada momento de juego se
                        sienta significativo.</p>

                    <p>En resumen, <strong>Red Dead Redemption 2</strong> es mucho más que un juego de acción; es una experiencia
                        cinematográfica en la que cada decisión cuenta, ambientada en un mundo abierto impresionante y
                        lleno de vida. Si buscas una aventura profunda, con una historia que te atrape y un mundo por
                        explorar, este título es una opción imperdible.</p>

                    <p><b>LO MEJOR Y LO PEOR</b></p>
                    <ul>
                        <li><b>✔</b> Historia absorbente y madura</li>
                        <li><b>✔</b> Mundo abierto rico y coherente</li>
                        <li><b>✔</b> Apartado técnico impresionante</li>
                        <li><b>✘</b> Ritmo lento puede no gustar a todos</li>
                        <li><b>✘</b> Controles algo rígidos en ciertas situaciones</li>
                    </ul>

                    <br>

                    <p><b>CONCLUSIÓN</b> Red Dead Redemption 2 es mucho más que un videojuego de acción en mundo
                        abierto. Es una carta de amor al western, una crítica social, y una demostración del poder del
                        medio interactivo para contar historias profundas. Imprescindible.</p>

                    <!-- Video Teaser -->
                    <p><b>Descubre más con el siguiente tráiler oficial:</b></p>

                    <figure style="text-align: center;">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/gmA6MrX81z4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <figcaption>Tráiler oficial de <strong>Red Dead Redemption 2</strong></figcaption>
                    </figure>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: $spacing-large;
    background-color: $background-color;
}

.title {
    text-align: center;
    margin-bottom: $spacing-large;

    h1 {
        font-size: 36px;
        text-transform: uppercase;
        color: $primary-color;
        margin-bottom: $spacing-small;
    }

    .nav {
        a {
            color: $text-color;
            font-size: $font-size-large;
            margin: 0 $spacing-medium;
            text-transform: uppercase;
            font-weight: bold;
            text-decoration: none;

            &:hover {
                color: lighten($primary-color, 10%);
            }
        }
    }
}

.box {
    background-color: $text-color;
    padding: $spacing-large;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
}

h3 {
    font-size: $font-size-xlarge;
    text-transform: uppercase;
    margin-bottom: $spacing-medium;
    background: $primary-color;
    color: $text-color;
    padding: $spacing-small $spacing-medium;
    border-radius: $border-radius;
    display: inline-block;
}

.about {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-large;

    .image {
        width: 100%;
        max-width: 1000px;
        border-radius: 16px;
        box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.02);
        }
    }

    .text-content {
        width: 100%;
        color: $secondary-color;
        text-align: justify;

        p {
            margin-bottom: $spacing-medium;
        }

        ul {
            list-style: none;
            padding-left: 0;

            li {
                margin-bottom: $spacing-small;
                font-size: $font-size-base;

                b {
                    color: $primary-color;
                    margin-right: $spacing-small;
                }
            }
        }

        b {
            color: $primary-color;
        }

        a {
            color: lighten($primary-color, 20%);
            text-decoration: none;

            &:hover {
                color: darken($primary-color, 10%);
            }
        }
    }
}
</style>
