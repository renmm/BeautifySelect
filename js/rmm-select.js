!function($){

	var msVersion = navigator.userAgent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/),
      msie = !!msVersion,
      ie6 = msie && parseFloat(msVersion[1]) < 7;

  	// Help prevent flashes of unstyled content
	if (!ie6) {
		document.documentElement.className = document.documentElement.className + ' dk_fouc';
	}
	//define plugs 
	var toggle = '[data-toggle=select]'
	  , lists   = []
      , keyMap = {
	      'left'  : 37,
	      'up'    : 38,
	      'right' : 39,
	      'down'  : 40,
	      'enter' : 13
    	}
	  ,	Select = function(element, options){
		this.init("select", element, options);
		}

	Select.prototype = {
		constructor: Select
	  , init: function(type, element, options){
			this.type = type;
			this.$element = $(element);
			this.options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			var
		        // The current <select> element
		        $select = this.$element,

		        // Store a reference to the originally selected <option> element
		        $original = $select.find(':selected').first() || $select.val(),

		        // Save all of the <option> elements
		        $options = $select.find('option'),

		        // We store lots of great stuff using jQuery data
		        data = $select.data('select') || {},

		        // This gets applied to the 'dk_container' element
		        id = $select.attr('id') || $select.attr('name'),

		        // This gets updated to be equal to the longest <option> element
		        width  = this.options.width || $select.outerWidth(),

		        // Check if we have a tabindex set or not
		        tabindex  = $select.attr('tabindex') ? $select.attr('tabindex') : '',

		        // The completed dk_container element
		        $dk = false,

		        theme
		      ;

		      // Dont do anything if we've already setup dropkick on this element
		      if (data.id) {
		        return $select;
		      } else {
		        data.options  = this.options;
		        data.tabindex  = tabindex;
		        data.id        = id;
		        data.$original = $original;
		        data.$select   = $select;
		        data.value     = _notBlank($select.val()) || _notBlank($original.attr('value'));
		        data.label     = $original.text();
		        data.$options   = $options;
		      }

		      // Build the dropdown HTML
		      $dk = _build(data);

		      // Make the dropdown fixed width if desired
		      $dk.find('.dk_toggle').css({
		        'width' : width + 'px'
		      });

		      // Hide the <select> list and place our new one in front of it
		      $select.before($dk);

		      // Update the reference to $dk
		      $dk = $('#dk_container_' + id).fadeIn(this.options.startSpeed);

		      // Save the current theme
		      theme = this.options.theme ? this.options.theme : 'default';
		      $dk.addClass('dk_theme_' + theme);
		      data.theme = theme;

		      // Save the updated $dk reference into our data object
		      data.$dk = $dk;

		      // Save the dropkick data onto the <select> element
		      $select.data('dropkick', data);

		      // Do the same for the dropdown, but add a few helpers
		      $dk.data('select', data);

		      lists[lists.length] = $select;

		      // Focus events
		      $dk.bind('focus.select', function (e) {
		        $dk.addClass('dk_focus');
		      }).bind('blur.select', function (e) {
		        $dk.removeClass('dk_open dk_focus');
		      });

		      setTimeout(function () {
		        $select.hide();
		      }, 0);
		}
	  , theme: function(){
	  		var
		      $select   = this.$element,
		      list      = $select.data('select'),
		      $dk       = list.$dk,
		      oldtheme  = 'dk_theme_' + list.theme
		    ;

		    $dk.removeClass(oldtheme).addClass('dk_theme_' + newTheme);

		    list.theme = newTheme;
	  	}
	  , reset: function(){
	  		for (var i = 0, l = lists.length; i < l; i++) {
			      var
			        listData  = lists[i].data('select'),
			        $dk       = listData.$dk,
			        $current  = $dk.find('li').first()
			      ;

			      $dk.find('.dk_label').text(listData.label);
			      $dk.find('.dk_options_inner').animate({ scrollTop: 0 }, 0);

			      _setCurrent($current, $dk);
			      _updateFields($current, $dk, true);
    		}
	  }
	}

	//private function

	function _handleKeyBoardNav(e, $dk) {
    var
      code     = e.keyCode,
      data     = $dk.data('select'),
      options  = $dk.find('.dk_options'),
      open     = $dk.hasClass('dk_open'),
      current  = $dk.find('.dk_option_current'),
      first    = options.find('li').first(),
      last     = options.find('li').last(),
      next,
      prev
    ;

    switch (code) {
      case keyMap.enter:
        if (open) {
          _updateFields(current.find('a'), $dk);
          _closeDropdown($dk);
        } else {
          _openDropdown($dk);
        }
        e.preventDefault();
      break;

      case keyMap.up:
        prev = current.prev('li');
        if (open) {
          if (prev.length) {
            _setCurrent(prev, $dk);
          } else {
            _setCurrent(last, $dk);
          }
        } else {
          _openDropdown($dk);
        }
        e.preventDefault();
      break;

      case keyMap.down:
        if (open) {
          next = current.next('li').first();
          if (next.length) {
            _setCurrent(next, $dk);
          } else {
            _setCurrent(first, $dk);
          }
        } else {
          _openDropdown($dk);
        }
        e.preventDefault();
      break;

      default:
      break;
    }
  }
	// Update the <select> value, and the dropdown label
  function _updateFields(option, $dk, reset) {
    var value, label, data;

    value = option.attr('data-dk-dropdown-value');
    label = option.text();
    data  = $dk.data('select');

    $select = data.$select;
    $select.val(value);

    $dk.find('.dk_label').text(label);

    reset = reset || false;

    if (data.options.change && !reset) {
      data.options.change.call($select, value, label);
    }
  }

  // Set the currently selected option
  function _setCurrent($current, $dk) {
    $dk.find('.dk_option_current').removeClass('dk_option_current');
    $current.addClass('dk_option_current');

    _setScrollPos($dk, $current);
  }

  function _setScrollPos($dk, anchor) {
    var height = anchor.prevAll('li').outerHeight() * anchor.prevAll('li').length;
    $dk.find('.dk_options_inner').animate({ scrollTop: height + 'px' }, 0);
  }

  // Close a dropdown
  function _closeDropdown($dk) {
    $dk.removeClass('dk_open');
  }

  // Open a dropdown
  function _openDropdown($dk) {
    var data = $dk.data('select');
    $dk.find('.dk_options').css({ top : $dk.find('.dk_toggle').outerHeight() - 1 });
    $dk.toggleClass('dk_open');

  }
	/**
   * Turn the dropdownTemplate into a jQuery object and fill in the variables.
   */
  function _build (view) {
    var
      // Template for the dropdown
      template  = view.options.selectTemplate,
      // Holder of the dropdowns options
      options   = [],
      $dk
    ;

    template = template.replace('{{ id }}', view.id);
    template = template.replace('{{ label }}', view.label);
    template = template.replace('{{ tabindex }}', view.tabindex);

    if (view.$options && view.$options.length) {
      for (var i = 0, l = view.$options.length; i < l; i++) {
        var
          $option   = $(view.$options[i]),
          current   = 'dk_option_current',
          oTemplate = view.options.optionTemplate
        ;

        oTemplate = oTemplate.replace('{{ value }}', $option.val());
        oTemplate = oTemplate.replace('{{ current }}', (_notBlank($option.val()) === view.value) ? current : '');
        oTemplate = oTemplate.replace('{{ text }}', $option.text());

        options[options.length] = oTemplate;
      }
    }

    $dk = $(template);
    $dk.find('.dk_options_inner').html(options.join(''));

    return $dk;
  }

  function _notBlank(text) {
    return ($.trim(text).length > 0) ? text : false;
  }
	//no conflict
	var old = $.fn.select;

	$.fn.select = function(option){
		return this.each(function(){
			var $this = $(this)
			  , data = $this.data('select')
			  , options = typeof option == 'object' && option;

			if(!data){
				$this.data('select', data = new Select(this,options));
			}
			if(typeof option =='string'){
				data[option]();
			}
		});
	}

	$.fn.select.Constructor = Select;

	$.fn.select.defaults = {
		startSpeed: 1000,  // I recommend a high value here, I feel it makes the changes less noticeable to the user
      	theme: false,
      	change: false,
      	selectTemplate: [
	      '<div class="dk_container" id="dk_container_{{ id }}" tabindex="{{ tabindex }}">',
	        '<a class="dk_toggle">',
	          '<span class="dk_label">{{ label }}</span>',
	        '</a>',
	        '<div class="dk_options">',
	          '<ul class="dk_options_inner">',
	          '</ul>',
	        '</div>',
	      '</div>'
    	].join(''),
    	optionTemplate: '<li class="{{ current }}"><a data-dk-dropdown-value="{{ value }}">{{ text }}</a></li>'

	}

	$.fn.select.noConflict = function(){
		$.fn.select = old;
		return this;
	}

	// Global Event
	$(function(){
		// Handle click events on the dropdown toggler
    	$(document).on('click.select', '.dk_toggle', function (e) {
	      var $dk  = $(this).parents('.dk_container').first();

	      _openDropdown($dk);

	      if ("ontouchstart" in window) {
	        $dk.addClass('dk_touch');
	        $dk.find('.dk_options_inner').addClass('scrollable vertical');
	      }

	      e.preventDefault();
	      return false;
    	});

	    // Handle click events on individual dropdown options
	    $(document).on((msie ? 'mousedown.select' : 'click.select'), '.dk_options a', function (e) {
	      var
	        $option = $(this),
	        $dk     = $option.parents('.dk_container').first(),
	        data    = $dk.data('select')
	      ;
	    
	      _closeDropdown($dk);
	      _updateFields($option, $dk);
	      _setCurrent($option.parent(), $dk);
	    
	      e.preventDefault();
	      return false;
	    });

	    // Setup keyboard nav
	    $(document).bind('keydown.select', function (e) {
	      var
	        // Look for an open dropdown...
	        $open    = $('.dk_container.dk_open'),

	        // Look for a focused dropdown
	        $focused = $('.dk_container.dk_focus'),

	        // Will be either $open, $focused, or null
	        $dk = null
	      ;

	      // If we have an open dropdown, key events should get sent to that one
	      if ($open.length) {
	        $dk = $open;
	      } else if ($focused.length && !$open.length) {
	        // But if we have no open dropdowns, use the focused dropdown instead
	        $dk = $focused;
	      }

	      if ($dk) {
	        _handleKeyBoardNav(e, $dk);
	      }
	    });
	});

	if(typeof define === 'function' && define.amd){
		define(['jquery'],function($){ return })
	}
}(window.jQuery);