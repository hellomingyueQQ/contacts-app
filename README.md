![image-20240905172550120](G:\DumpCodes\My contacts-app\images\image-20240905172550120.png)

requiredTrue 主要应用于给 Checkbox

#### 5-3

再添加了<em \*ngIf="contactForm.controls.firstName.invalid">Please enter a First Name</em>，新建时候就会出现下面的情况，这是不对的，因为还没开始编辑

![image-20240905174949116](G:\DumpCodes\My contacts-app\images\image-20240905174949116.png)

#### 6-4

现在要创建 custom control bound to form models，啥意思？
这节课只讲做 component 了，下节课
目前 profile 没有绑定到 formControl，所以 save 不下来
实现 controlValueAccessor，实现 formcontrolname 的值能设置进去，且 component 的改变，能传回 formcontrol
这个跟把 formgroup 弄小还不一样
