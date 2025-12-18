<template>
  <div class="landingPage">
    <!--header start-->
    <header>
      <div class="container-fluid">
        <div class="row">
          <div class="col p-0">
            <div class="top-header">
              <div class="logo pl-2">
                <nuxt-link class="navbar-brand" :to="{ path: '/' }"> <img src="/images/landing-page/header/logo.png" alt="logo" /></nuxt-link>
              </div>
              <div class="main-menu ml-auto" id="nav">
                <nav id="navbar-example2" class="navbar navbar-expand-lg navbar-light">
                  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#scroll-spy" aria-controls="scroll-spy" @click="openNavMenu()">
                    <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse" :class="{ show: opennavmenu }" id="scroll-spy">
                    <ul class="navbar-nav mx-auto nav">
                      <li class="nav-item">
                        <a class="nav-link active" href="#img-bg">Home</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#feature">Features</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#frontend">frontend</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#admin">admin</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#special">special feature</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#inside">insides</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#core">core feature</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#footer">footer</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSe6hKUXw_By-pg7yabL0FxoTM02ZPTxoXy8PE3yboRuUCuyeA/viewform">Hire us</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" target="_blank" href="http://docs.pixelstrap.com/vue/multikart/document/">Documentation</a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div>
                <form target="_blank" class="form-inline my-lg-0" action="https://themeforest.net/item/multikart-responsive-vuejs-ecommerce-template/25174665">
                  <button class="btn my-sm-0 purchase-btn">PURCHASE</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!--header end-->
    <!--home section start-->
    <section class="main-img responsive-img pt-0" id="img-bg">
      <div class="container-fluid">
        <div class="main-contain">
          <div>
            <h1 class="m-0">
              MULTI
              <span>KART</span>
            </h1>
            <h3 class="m-0">
              The
              <span>BEST SELLING</span> Minimal Theme
            </h3>
            <img src="/images/landing-page/text.png" alt class="img-fluid" />
            <div class="mt-4"
              ><a target="_blank" href="https://multikart-nine.vercel.app/" class="btn btn-primary m-0 d-inline-block">Front-End</a>
              <a target="_blank" href="https://vue.pixelstrap.com/multikart-admin/dashboard" class="btn btn-secondary d-inline-block ms-3">Back-end</a></div
            >
          </div>
        </div>
        <div class="home-decor">
          <div class="decor-1 decor wow zoomIn" id="img-1">
            <img src="/images/landing-page/slider/1.png" alt class="img-fluid" />
          </div>
          <div class="decor-2 decor wow zoomIn" id="img-2">
            <img src="/images/landing-page/slider/5.png" alt class="img-fluid" />
          </div>
          <div class="decor-3 decor wow zoomIn" id="img-3">
            <img src="/images/landing-page/slider/2.png" alt class="img-fluid" />
          </div>
          <div class="decor-4 decor wow zoomIn" id="img-4">
            <img src="/images/landing-page/slider/4.png" alt class="img-fluid" />
          </div>
          <div class="decor-5 decor wow zoomIn" id="img-5">
            <img src="/images/landing-page/slider/3.png" alt class="img-fluid" />
          </div>
          <div class="decor-6 decor wow zoomIn" id="img-6">
            <img src="/images/landing-page/slider/6.png" alt class="img-fluid" />
          </div>
          <div class="decor-7 decor wow zoomIn" id="img-7">
            <img src="/images/landing-page/slider/11.png" alt class="img-fluid" />
          </div>
          <div class="decor-8 decor wow zoomIn" id="img-8">
            <img src="/images/landing-page/slider/7.png" alt class="img-fluid" />
          </div>
          <div class="decor-9 decor wow zoomIn" id="img-9">
            <img src="/images/landing-page/slider/8.png" alt class="img-fluid" />
          </div>
          <div class="decor-10 decor wow zoomIn" id="img-10">
            <img src="/images/landing-page/slider/10.png" alt class="img-fluid" />
          </div>
          <div class="decor-11 decor wow zoomIn" id="img-11">
            <img src="/images/landing-page/slider/9.png" alt class="img-fluid" />
          </div>
        </div>
      </div>
    </section>
    <!--home section end-->
    <!--feature section start-->
    <section id="feature" class="section-lr section-b-space feature-section">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="feature text-center">
              <div>
                <h5 class="title-landing">Reasones to Buy Multikart</h5>
                <p class="pb-3">Multikart VUE template is an apparently simple but highly functional tempalate designed for creating a flourisahing online business. </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row feature_row">
        <div class="col-xl-3 col-md-6">
          <div class="feature-box">
            <div class="feature-image">
              <img class="img-fluid" src="/images/landing-page/main-features/nuxt_ssr.png" alt="img" />
            </div>
            <div class="feature-content">
              <ul class="color-varient">
                <li class="red"></li>
                <li class="orange"></li>
                <li class="green"></li>
              </ul>
              <h6>SSR Enabled </h6>
            </div>
            <p class="para">With Server Side Rendering Enabled, SEO of your website will sky rocket. Along with that initial page load will take less time.</p>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="feature-box">
            <div class="feature-image">
              <img class="img-fluid" src="/images/landing-page/main-features/customizer.png" alt="img" />
            </div>
            <div class="feature-content">
              <ul class="color-varient">
                <li class="red"></li>
                <li class="orange"></li>
                <li class="green"></li>
              </ul>
              <h6>Customizer</h6>
            </div>
            <p class="para">Customizer helps you to Design Unlimited possibilites for your theme so that you can build perfect ecommerce site in Nuxt Js </p>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="feature-box">
            <div class="feature-image">
              <img class="img-fluid" src="/images/landing-page/main-features/email.png" alt="img" />
            </div>
            <div class="feature-content">
              <ul class="color-varient">
                <li class="red"></li>
                <li class="orange"></li>
                <li class="green"></li>
              </ul>
              <h6>Email Template</h6>
            </div>
            <p class="para">Emails are basic necessity for any ecommerce site so we provide email html templates so it be easy to implement for your project</p>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="feature-box">
            <div class="feature-image">
              <img class="img-fluid" src="/images/landing-page/main-features/payment.png" alt="img" />
            </div>
            <div class="feature-content">
              <ul class="color-varient">
                <li class="red"></li>
                <li class="orange"></li>
                <li class="green"></li>
              </ul>
              <h6>Payment Gateway Integrated</h6>
            </div>
            <p class="para">Take payment from your customers globally with paypal and stripe.</p>
          </div>
        </div>
      </div>
    </section>
    <!--feature section end-->
    <!--effect section start-->
    <section class="pt-0 effect-cls">
      <div class="demo-slider">
        <div class="demo">
          <div class="right-part">
            <div>
              <h4>16+ DEMO</h4>
              <h5 class="font-style">just for you</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--effect section end-->
    <!--demo/pages section start-->
    <section id="frontend" class="section-b-space section-lr main-demo">
      <div class="container-fluid">
        <div class="tabs">
          <div>
            <ul class="nav nav-pills" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <a class="nav-link active" href="#" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</a>
              </li>

              <li class="nav-item" role="presentation">
                <a class="nav-link" href="#" id="product-tab" data-bs-toggle="tab" data-bs-target="#product" type="button" role="tab" aria-controls="product" aria-selected="false">Product</a>
              </li>
              <li class="nav-item" role="presentation">
                <a class="nav-link" href="#" id="shop-tab" data-bs-toggle="tab" data-bs-target="#shop" type="button" role="tab" aria-controls="shop" aria-selected="false">Shop</a>
              </li>
              <li class="nav-item" role="presentation">
                <a class="nav-link" href="#" id="other-tab" data-bs-toggle="tab" data-bs-target="#other" type="button" role="tab" aria-controls="contact" aria-selected="false">Others</a>
              </li>

              <li class="nav-item" role="presentation">
                <a class="nav-link" href="#" id="blog-tab" data-bs-toggle="tab" data-bs-target="#blog" type="button" role="tab" aria-controls="blog" aria-selected="false">Blog</a>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab"
                ><div>
                  <div class="row">
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/fashion' }" target="_blank">
                        <img src="/images/landing-page/special features/1.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>Fashion classic</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/tools' }" target="_blank">
                        <img src="/images/landing-page/special features/2.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>tools</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/gym' }" target="_blank">
                        <img src="/images/landing-page/special features/4.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>gym</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/jewellery' }" target="_blank">
                        <img src="/images/landing-page/special features/7.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>jewellery</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/pets' }" target="_blank">
                        <img src="/images/landing-page/special features/8.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>pets</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/fashion-2' }" target="_blank">
                        <img src="/images/landing-page/special features/11.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>Fashion Minimal</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/fashion-3' }" target="_blank">
                        <img src="/images/landing-page/special features/12.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>Fashion Modern</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/shoes' }" target="_blank">
                        <img src="/images/landing-page/special features/13.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>shoes</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/bags' }" target="_blank">
                        <img src="/images/landing-page/special features/14.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>bag</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/watch' }" target="_blank">
                        <img src="/images/landing-page/special features/15.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>watch</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/kids' }" target="_blank">
                        <img src="/images/landing-page/special features/16.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>kids</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/flower' }" target="_blank">
                        <img src="/images/landing-page/special features/17.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>flower</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/vegetables' }" target="_blank">
                        <img src="/images/landing-page/special features/19.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>vegetables</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/beauty' }" target="_blank">
                        <img src="/images/landing-page/special features/20.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>beauty</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/electronics-1' }" target="_blank">
                        <img src="/images/landing-page/special features/25.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>electronic classic</h3>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/shop/furniture' }" target="_blank">
                        <img src="/images/landing-page/special features/30.jpg" class="img-fluid" />
                      </nuxt-link>
                      <h3>furniture</h3>
                    </div>
                  </div>
                </div></div
              >
              <div class="tab-pane fade" id="product" role="tabpanel" aria-labelledby="product-tab"
                ><div>
                  <div class="row">
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/four-image' }" target="_blank">
                        <img src="/images/landing-page/special features/product/12.jpg" class="img-fluid" />
                        <h3>4 image</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/bundle-product' }" target="_blank">
                        <img src="/images/landing-page/special features/product/13.jpg" class="img-fluid" />
                        <h3>product bundle</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/three-column/thumbnail-left' }" target="_blank">
                        <img src="/images/landing-page/special features/product/1.jpg" class="img-fluid" />
                        <h3>3 col left</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/three-column/thumbnail-right' }" target="_blank">
                        <img src="/images/landing-page/special features/product/2.jpg" class="img-fluid" />
                        <h3>3 col right</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/three-column/thumbnail-bottom' }" target="_blank">
                        <img src="/images/landing-page/special features/product/3.jpg" class="img-fluid" />
                        <h3>3 column</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/thumbnail-image/left-image' }" target="_blank">
                        <img src="/images/landing-page/special features/product/5.jpg" class="img-fluid" />
                        <h3>left image</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/sidebar/1' }" target="_blank">
                        <img src="/images/landing-page/special features/product/6.jpg" class="img-fluid" />
                        <h3>left sidebar</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: 'product/sidebar/no-sidebar' }" target="_blank">
                        <img src="/images/landing-page/special features/product/7.jpg" class="img-fluid" />
                        <h3>no sidebar</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/thumbnail-image/right-image' }" target="_blank">
                        <img src="/images/landing-page/special features/product/8.jpg" class="img-fluid" />
                        <h3>right image</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/thumbnail-image/image-outside' }" target="_blank">
                        <img src="/images/landing-page/special features/product/15.jpg" class="img-fluid" />
                        <h3>image outside</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/product/sidebar/right-sidebar' }" target="_blank">
                        <img src="/images/landing-page/special features/product/9.jpg" class="img-fluid" />
                        <h3>right sidebar</h3>
                      </nuxt-link>
                    </div>
                  </div>
                </div></div
              >
              <div class="tab-pane fade" id="shop" role="tabpanel" aria-labelledby="shop-tab"
                ><div>
                  <div class="row">
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/metro' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/6.jpg" class="img-fluid" />
                        <h3>metro</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/full-width' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/10.jpg" class="img-fluid" />
                        <h3>full width</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/leftsidebar/all' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/1.jpg" class="img-fluid" />
                        <h3>left sidebar</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/no-sidebar' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/2.jpg" class="img-fluid" />
                        <h3>no sidebar</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/right-sidebar' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/3.jpg" class="img-fluid" />
                        <h3>right sidebar</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/sidebar-popup' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/4.jpg" class="img-fluid" />
                        <h3>sidebar popup</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/three-grid' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/7.jpg" class="img-fluid" />
                        <h3>3 grid</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/six-grid' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/8.jpg" class="img-fluid" />
                        <h3>6 grid</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/collection/list-view' }" target="_blank">
                        <img src="/images/landing-page/special features/shop/9.jpg" class="img-fluid" />
                        <h3>list view</h3>
                      </nuxt-link>
                    </div>
                  </div>
                </div></div
              >
              <div class="tab-pane fade" id="other" role="tabpanel" aria-labelledby="other-tab"
                ><div>
                  <div class="row">
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/account/wishlist' }" target="_blank">
                        <img src="/images/landing-page/special features/other/1.jpg" class="img-fluid" />
                        <h3>wishlist</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/account/cart' }" target="_blank">
                        <img src="/images/landing-page/special features/other/2.jpg" class="img-fluid" />
                        <h3>cart</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/account/dashboard' }" target="_blank">
                        <img src="/images/landing-page/special features/other/3.jpg" class="img-fluid" />
                        <h3>dashboard</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/auth/LoginPage' }" target="_blank">
                        <img src="/images/landing-page/special features/other/4.jpg" class="img-fluid" />
                        <h3>login</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/auth/LoginPage' }" target="_blank">
                        <img src="/images/landing-page/special features/other/5.jpg" class="img-fluid" />
                        <h3>register</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/account/contact' }" target="_blank">
                        <img src="/images/landing-page/special features/other/6.jpg" class="img-fluid" />
                        <h3>contact us</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/account/forget-password' }" target="_blank">
                        <img src="/images/landing-page/special features/other/7.jpg" class="img-fluid" />
                        <h3>forget password</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/account/profile' }" target="_blank">
                        <img src="/images/landing-page/special features/other/8.jpg" class="img-fluid" />
                        <h3>profile</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/account/checkout' }" target="_blank">
                        <img src="/images/landing-page/special features/other/9.jpg" class="img-fluid" />
                        <h3>checkout</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/about' }" target="_blank">
                        <img src="/images/landing-page/special features/other/10.jpg" class="img-fluid" />
                        <h3>about us</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/search' }" target="_blank">
                        <img src="/images/landing-page/special features/other/11.jpg" class="img-fluid" />
                        <h3>search</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/typography' }" target="_blank">
                        <img src="/images/landing-page/special features/other/12.jpg" class="img-fluid" />
                        <h3>typography</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/review' }" target="_blank">
                        <img src="/images/landing-page/special features/other/13.jpg" class="img-fluid" />
                        <h3>review</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/order-success' }" target="_blank">
                        <img src="/images/landing-page/special features/other/14.jpg" class="img-fluid" />
                        <h3>order success</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/compare/compare-1' }" target="_blank">
                        <img src="/images/landing-page/special features/other/15.jpg" class="img-fluid" />
                        <h3>compare 1</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/compare/compare-2' }" target="_blank">
                        <img src="/images/landing-page/special features/other/16.jpg" class="img-fluid" />
                        <h3>compare 2</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/collection' }" target="_blank">
                        <img src="/images/landing-page/special features/other/17.jpg" class="img-fluid" />
                        <h3>collection</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/lookbook' }" target="_blank">
                        <img src="/images/landing-page/special features/other/18.jpg" class="img-fluid" />
                        <h3>lookbook</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/404' }" target="_blank">
                        <img src="/images/landing-page/special features/other/20.jpg" class="img-fluid" />
                        <h3>404</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/coming-soon' }" target="_blank">
                        <img src="/images/landing-page/special features/other/21.jpg" class="img-fluid" />
                        <h3>coming soon</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/page/faq' }" target="_blank">
                        <img src="/images/landing-page/special features/other/22.jpg" class="img-fluid" />
                        <h3>FAQ</h3>
                      </nuxt-link>
                    </div>
                  </div>
                </div></div
              >
              <div class="tab-pane fade" id="blog" role="tabpanel" aria-labelledby="blog-tab"
                ><div>
                  <div class="row">
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/blog/blog-detail' }" target="_blank">
                        <img src="/images/landing-page/special features/blog/1.jpg" class="img-fluid" />
                        <h3>blog deatils</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/blog/blog-nosidebar' }" target="_blank">
                        <img src="/images/landing-page/special features/blog/2.jpg" class="img-fluid" />
                        <h3>no sidebar</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/blog/blog-leftsidebar' }" target="_blank">
                        <img src="/images/landing-page/special features/blog/3.jpg" class="img-fluid" />
                        <h3>left sidebar</h3>
                      </nuxt-link>
                    </div>
                    <div class="col-xl-3 col-sm-6 col-12 demo-box">
                      <nuxt-link :to="{ path: '/blog/blog-rightsidebar' }" target="_blank">
                        <img src="/images/landing-page/special features/blog/4.jpg" class="img-fluid" />
                        <h3>right sidebar</h3>
                      </nuxt-link>
                    </div>
                  </div>
                </div></div
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--demo/pages section start-->

    <section id="admin" class="pt-0 section-b-space section-lr"
      ><div class="container-fluid"
        ><div id="admin" class="row"
          ><div class="col"
            ><div class="admin-title pb-0"
              ><div class="text-center"><h4>E-commerce admin template</h4></div></div
            ></div
          ></div
        >
        <div class="row"
          ><div class="col-xl-3 col-sm-6 col-12 demo-box"
            ><a href="https://vue.pixelstrap.com/multikart-admin/dashboard" target="_blank"><img src="/images/landing-page/admin/1.jpg" class="img-fluid blur-up lazyloaded" /></a>
            <h3>dashboard</h3></div
          >
          <div class="col-xl-3 col-sm-6 col-12 demo-box"
            ><a href="https://vue.pixelstrap.com/multikart-admin/physical/product-list" target="_blank"><img src="/images/landing-page/admin/2.jpg" class="img-fluid blur-up lazyloaded" /></a>
            <h3>product list</h3></div
          >
          <div class="col-xl-3 col-sm-6 col-12 demo-box"
            ><a href="https://vue.pixelstrap.com/multikart-admin/app/reports" target="_blank"><img src="/images/landing-page/admin/3.jpg" class="img-fluid blur-up lazyloaded" /></a>
            <h3>report page</h3></div
          >
          <div class="col-xl-3 col-sm-6 col-12 demo-box"
            ><a href="https://vue.pixelstrap.com/multikart-admin/app/media" target="_blank"><img src="/images/landing-page/admin/4.jpg" class="img-fluid blur-up lazyloaded" /></a>
            <h3>media page</h3></div
          ></div
        ></div
      ></section
    >

    <!--special feature section start-->
    <section id="special" class="special-feature section-lr section-b-space">
      <div class="container-fluid feature_row">
        <div class="row">
          <div class="col-12">
            <div class="feature text-center">
              <div>
                <h5 class="title-landing">Our special features</h5>
                <p class="pb-3"> Multikart HTML template is an apparently simple but highly functional tempalate designed for creating a flourisahing online business. </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row feature-sec">
          <div class="col-lg-4 col-md-6 col-12">
            <div class="feature-box">
              <div class="feature-content">
                <ul class="color-varient">
                  <li class="red"></li>
                  <li class="orange"></li>
                  <li class="green"></li>
                </ul>
                <h6>Attractive lookbook</h6>
              </div>
              <div class="feature-image">
                <img class="img-fluid w-100" src="/images/landing-page/special features/lookbook.png" alt="img" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12">
            <div class="feature-box">
              <div class="feature-content">
                <ul class="color-varient">
                  <li class="red"></li>
                  <li class="orange"></li>
                  <li class="green"></li>
                </ul>
                <h6>10+ product hover</h6>
              </div>
              <div class="feature-image">
                <img class="img-fluid w-100" src="/images/landing-page/special features/hover.png" alt="img" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12">
            <div class="feature-box">
              <div class="feature-content">
                <ul class="color-varient">
                  <li class="red"></li>
                  <li class="orange"></li>
                  <li class="green"></li>
                </ul>
                <h6>off-canvas cart</h6>
              </div>
              <div class="feature-image">
                <img class="img-fluid w-100" src="/images/landing-page/special features/Off-canvas.png" alt="img" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12">
            <div class="feature-box">
              <div class="feature-content">
                <ul class="color-varient">
                  <li class="red"></li>
                  <li class="orange"></li>
                  <li class="green"></li>
                </ul>
                <h6>Color Option</h6>
              </div>
              <div class="feature-image">
                <img class="img-fluid w-100" src="/images/landing-page/special features/color-option.png" alt="img" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12">
            <div class="feature-box">
              <div class="feature-content">
                <ul class="color-varient">
                  <li class="red"></li>
                  <li class="orange"></li>
                  <li class="green"></li>
                </ul>
                <h6>product filter</h6>
              </div>
              <div class="feature-image">
                <img class="img-fluid w-100" src="/images/landing-page/special features/product-filter.png" alt="img" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12">
            <div class="feature-box">
              <div class="feature-content">
                <ul class="color-varient">
                  <li class="red"></li>
                  <li class="orange"></li>
                  <li class="green"></li>
                </ul>
                <h6>Countdown</h6>
              </div>
              <div class="feature-image">
                <img class="img-fluid w-100" src="/images/landing-page/special features/countdown.png" alt="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--special feature section end-->

    <!--cart variation section start-->
    <section id="inside" class="cart section-b-space">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="cart-contain text-center feature">
              <h5 class="title-landing">cart variation</h5>
              <p class="pb-3">Multikart has 5+ add to cart vartiation which include left, right, top, bottom, quanitity counter and popup.</p>
              <img src="/images/landing-page/cart/cart.gif" class="img-fluid gif" alt="cartimage" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--cart variation section end-->

    <!--portfolio section start-->
    <section class="gallery pb-0">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="text-center">
              <h5 class="title-landing">portfolio pages</h5>
              <p class="pb-3">Multikart include 3 grid view portfolio pages and 4 masonary view portfolio pages.</p>
            </div>
          </div>
        </div>
        <div class="row align-items-end sm-space-gallery">
          <div class="col-md-6 gallery1">
            <img src="/images/landing-page/gallery/1.jpg" alt="galleryimg" class="img-fluid email-img" />
          </div>
          <div class="col-md-6 gallery2">
            <img src="/images/landing-page/gallery/2.jpg" alt="galleryimg" class="img-fluid email-img" />
          </div>
        </div>
      </div>
    </section>
    <!--portfolio section end-->

    <!--core feature section start-->
    <section id="core" class="main-feature section-b-space">
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center">
            <div class="heading-title">
              <h5 class="title-landing">Core Features</h5>
              <p class="pb-3">And there is many more features..</p>
            </div>
          </div>
        </div>
        <div class="row key-feature">
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/24.png" alt="fetures" />
                  </div>
                </div>
                <h5>Nuxt 3</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/1.png" alt="fetures" />
                  </div>
                </div>
                <h5>Html5</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/2.png" alt="fetures" />
                  </div>
                </div>
                <h5>Css3</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/3.png" alt="fetures" />
                  </div>
                </div>
                <h5>Bootstrap</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/4.png" alt="fetures" />
                  </div>
                </div>
                <h5>Sass</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/5.png" alt="fetures" />
                  </div>
                </div>
                <h5>W3 Validate</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/6.png" alt="fetures" />
                  </div>
                </div>
                <h5>Unlimited color filters</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/9.png" alt="fetures" />
                  </div>
                </div>
                <h5>Multilevel Menu</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/11.png" alt="fetures" />
                  </div>
                </div>
                <h5>Instagram shop</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/12.png" alt="fetures" />
                  </div>
                </div>
                <h5>Social Link</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/25.png" alt="fetures" />
                  </div>
                </div>
                <h5>SwiperJS</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/14.png" alt="fetures" />
                  </div>
                </div>
                <h5>Google fonts</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/15.png" alt="fetures" />
                  </div>
                </div>
                <h5>Product Compare</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/16.png" alt="fetures" />
                  </div>
                </div>
                <h5>Tap to top</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/17.png" alt="fetures" />
                  </div>
                </div>
                <h5>Collection Grid</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/19.png" alt="fetures" />
                  </div>
                </div>
                <h5>Well Documentation</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/20.png" alt="fetures" />
                  </div>
                </div>
                <h5>Pro - Countdown</h5>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-md-3 col-6">
            <div class="theme-collection">
              <div>
                <div class="image-contain">
                  <div class="set-image">
                    <img src="/images/landing-page/icon/21.png" alt="fetures" />
                  </div>
                </div>
                <h5>SEO Friendly</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--core feature section end-->

    <!--footer section start-->
    <section id="footer" class="section-b-space grey-bg footer">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="footer-section">
              <div>
                <ul class="rate-section">
                  <li><i class="fa fa-star" aria-hidden="true"></i></li>
                  <li><i class="fa fa-star" aria-hidden="true"></i></li>
                  <li><i class="fa fa-star" aria-hidden="true"></i></li>
                  <li><i class="fa fa-star" aria-hidden="true"></i></li>
                  <li><i class="fa fa-star" aria-hidden="true"></i></li>
                </ul>
                <h2
                  >purchase the multikart <br />
                  & create beautiful online store</h2
                >
                <a target="_blank" href="https://themeforest.net/item/multikart-responsive-vuejs-ecommerce-template/25174665" class="btn btn-primary btn-bottom">purchase now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--footer section end-->
  </div>
</template>
<script>
definePageMeta({
  layout: "landing",
});
export default {
  data() {
    return {
      opennavmenu: false,
    };
  },
  methods: {
    openNavMenu() {
      this.opennavmenu = !this.opennavmenu;
    },
  },
};
</script>
