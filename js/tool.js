/**
 * Created by Administrator on 2015/12/18.
 */
//兼容ie的getElementsByClassName
(function(doc) {
    if (!doc.getElementsByClassName) {
        doc.getElementsByClassName = function (className, element) {
            var children = (element || doc).getElementsByTagName('*');
            var elements = [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var classNames = child.className.split(' ');
                for (var j = 0; j < classNames.length; j++) {
                    if (classNames[j] == className) {
                        elements.push(child);
                        break;
                    }
                }
            }
            return elements;
        };
    }
})(document);

//移除样式
function removeClass(obj,className) {
    var cName = obj.className.trim();
    var arr = cName.split(' ');
    var tArr = [];
    for(var i= 0,len=arr.length; i<len; i++) {
        if(arr[i]!=className) {
            tArr.push(arr[i]);
        }
    }
    obj.className = tArr.join(' ');
}

//增加样式
function addClass(obj,className) {
    obj.className = obj.className + ' ' +className;
}

// 兼容游览器的事件绑定
function addEvent(obj,event,fn) {
    if(obj.addEventListener) {
        obj.addEventListener(event,fn,false);
    } else if(obj.attachEvent){
        obj.attachEvent('on'+event,fn);
    } else {
        obj['on'+event] = fn;
    }
}

//去掉字符串两边的空格
String.prototype.trim = function () {
    return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
};