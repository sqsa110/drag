    var Util = {};
    //上拉插件
    Util.upLoading = function(opts){

        function UpLoad(opts){
            opts = $.extend({
                callback : function(){
                    console.log('回调函数！');
                },
                loadingFn : function(){
                    console.log('Loading函数！');
                }
            },opts);
            this.startY  = null;
            this.endY = null;
            this.$footer = null;
            this.downDataOff = false;
            this.callback = opts.callback;
            this.loadingFn = opts.loadingFn;
            this.away = 70;
            this.dragOff = true;
            this.init();
        }

        UpLoad.prototype.init = function(){
            this.touchEv();
            return this;
        };

        UpLoad.prototype.closeDragOff = function(){
            this.dragOff = false;
        }

        UpLoad.prototype.openDragOff = function(){
            this.dragOff = true;
        }

        UpLoad.prototype.touchEv = function(){
            this.touchStartEv();
            this.touchMoveEv();
            this.touchEndEv();
            return this;
        }

        UpLoad.prototype.touchStartEv = function(){
            var that = this;
            document.addEventListener('touchstart',function(ev){
                if (that.dragOff) {
                    var ev = ev || window.ev;
                    that.startFn(ev.touches[0].clientY);
                }
            },false);
            return this;
        }

        UpLoad.prototype.touchMoveEv = function(){
            var that = this;
            this.off = true;
            document.addEventListener('touchmove',function(ev){
                if (that.dragOff) {
                    var ev = ev || window.ev;
                    if (that.off) {
                        that.off = false;
                    }
                    that.moveFn(ev.touches[0].clientY);
                }
                //    ev.preventDefault();
            },false);
        }

        UpLoad.prototype.touchEndEv = function(){
            var that = this;
            document.addEventListener('touchend',function(ev){
                var ev = ev || window.ev;
                that.endFn(ev.changedTouches[0].clientY);
            },false);
            document.addEventListener('touchcancel',function(ev){
                var ev = ev || window.ev;
                that.endFn(ev.changedTouches[0].clientY);
            },false);
            return this;
        }

        UpLoad.prototype.startFn = function(y){
            this.startY = y;
            this.$footer = $('.fillhtml');
            if (this.$footer.length > 0) { return };
            this.$footer = $('<footer class="fillhtml">').css({
                width:'100%',
                height:'0px',
                clear : 'both'
            });
            $('body').append(this.$footer);
            return this;
        }

        UpLoad.prototype.moveFn = function(y){
            var docH = $(document).outerHeight(true);
            var winH = $(window).height();
            var winST = $(window).scrollTop();
            var footerH = this.$footer.outerHeight(true);
            var downH = this.startY - y;
            var H = 1 - downH / winH;
            downH = downH * H;
            if (docH - footerH <= winH + winST) {
                this.$footer.css('height',downH + 'px');
                $(window).scrollTop(winST - 0 + downH);
                if (downH - this.away) {
                    this.downDataOff = true;
                    this.loadingFn();
                }
            }
            return this;
        }

        UpLoad.prototype.endFn = function(y){
            this.endY = y;
            if (this.$footer && this.$footer.length > 0){
                this.$footer.remove();
                if (this.downDataOff) {
                    this.downDataOff = false;
                    this.callback && this.callback();
                }
            }
            return this;
        }

        return new UpLoad(opts);
    }
