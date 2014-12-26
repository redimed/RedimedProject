<form name="FAForm" ng-submit="submitFA(FAForm)"  accessible-form method="post" novalidate>
    <div class="row">
        <div class="col-md-12 ">
            <button type="submit"
            ng-disabled="!infoChanged()"
            class="btn green pull-right">{{isNew?"Add New":"Update"}}
            </button>
            <a href="http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/FA/{{infoH.FA_ID}}/{{infoH.CAL_ID}}/{{infoH.PATIENT_ID}}"
            ng-disabled="isNew "
            class="btn btn-primary blue pull-right">Print PDF
            </a>
            <a href="javascript:;" ng-disabled="!infoChanged()"  ng-click="resetForm()" class="btn btn-danger pull-right">Reset</a>
        </div>
    </div>
    <div ng-repeat="header in listFA">
        <div class="caption">
            <div class="row">
                <div class="col-md-12">
                    <p style="font-size: xx-large;text-align: center;font-weight: bolder">{{header.header_name}}</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="portlet box grey-cascade" ng-repeat="section in header.section">
                    <div class="portlet-title">
                        <div class="caption">
                            <i class="fa fa-gift"></i> {{section.section_name}}
                        </div>
                        <div class="tools">
                            <a href="javascript:;" class="collapse">
                            </a>
                        </div>
                    </div>
                    <div class="portlet-body" ng-repeat="line in section.line">
                        <div ng-if="line.line_type != 1" class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title">{{line.line_name}}</h3>
                            </div>
                            <div class="panel-body">
                                <div ng-if="line.image != null">
                                    <img ng-src="{{line.image}}">
                                    </div>
                                    <div ng-repeat="detail in line.detail">
                                        <ng-form name="numberForm">
                                            <label class="bold">{{detail.detail_name}}</label>
                                            <div ng-if="detail.image != null">
                                                <img ng-src="{{detail.image}}">
                                                </div>
                                                <div class="row">
                                                    <div ng-if="detail.val1_name != null" ng-class="{'col-md-3 col-lg-2 col-sm-3' : detail.val1_name != null && detail.val1_name.length >= 5, 'col-md-1 col-sm-1': detail.val1_name != null && detail.val1_name.length < 5}">
                                                        <label  style="margin-top: 10px" ng-class="{'pull-right' : detail.val1_name != null}">
                                                    {{detail.val1_name}}
                                                        </label>
                                                    </div>
                                                    <div ng-class="{'has-error':showClickedValidation  && numberForm.value1.$error.pattern}">
                                                        <div ng-if="detail.val1_isvalue == 1" ng-class="{'col-md-2 col-sm-3' : detail.val1_isvalue == 1}">
                                                            <div ng-if="detail.val1Validate != 1">
                                                                <input name="value1" type="text" ng-model="infoD.VAL1_VALUE[detail.detail_id]"  class="form-control">
                                                                </div>
                                                                <div ng-if="detail.val1Validate == 1">
                                                                    <input name="value1" type="text"  ng-pattern="/^[0-9]+$/" ng-model="infoD.VAL1_VALUE[detail.detail_id]" ng-change="mathScore(detail.detail_id,line.line_id,line.line_isscore1,line.line_israting1,line.line_isscore2,line.line_israting2,line.score_type1,line.score_type2,line.rating_id1)"  class="form-control">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div ng-if="detail.val1_ischeckbox == 1"  ng-class="{'col-md-1 col-sm-1' : detail.val1_ischeckbox == 1}">
                                                                <input class="form-control" ng-model="infoD.VAL1_CHECKBOX[detail.detail_id]" type="checkbox" ng-checked="infoD.VAL1_CHECKBOX[detail.detail_id]==1"/>
                                                            </div>
                                                            <div ng-if="detail.val1_ischeckbox == 2" ng-class="{'col-md-6 col-lg-4 col-sm-6' : detail.val1_ischeckbox == 2}">
                                                                <div class="btn-group ">
                                                                    <label class="btn">
                                                                        <input type="radio" ng-model="infoD.VAL1_CHECKBOX[detail.detail_id]" value="0"/> UNABLE
                                                                    </label>
                                                                    <label class="btn">
                                                                        <input type="radio" ng-model="infoD.VAL1_CHECKBOX[detail.detail_id]" value="1"/> PARTIAL
                                                                    </label>
                                                                    <label class="btn">
                                                                        <input type="radio" ng-model="infoD.VAL1_CHECKBOX[detail.detail_id]" value="2"/> ABLE
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div ng-if="detail.val1_ischeckbox == 3" ng-class="{'col-md-2 col-sm-3' : detail.val1_ischeckbox == 3}">
                                                                <div class="btn-group ">
                                                                    <label class="btn">
                                                                        <input type="radio" ng-model="infoD.VAL1_CHECKBOX[detail.detail_id]" value="0"/> Yes
                                                                    </label>
                                                                    <label class="btn">
                                                                        <input type="radio" ng-model="infoD.VAL1_CHECKBOX[detail.detail_id]" value="1"/> No
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div ng-if="detail.val2_name != null" ng-class="{'col-md-3 col-lg-2 col-sm-3' : detail.val2_name != null && detail.val2_name.length >= 5, 'col-md-1 col-sm-1': detail.val2_name != null && detail.val2_name.length < 5}">
                                                                <label  style="margin-top: 10px" ng-class="{'pull-right' : detail.val2_name != null}" >
                                                    {{detail.val2_name}}
                                                                </label>
                                                            </div>
                                                            <div ng-class="{'has-error':showClickedValidation  && numberForm.value2.$error.pattern}">
                                                                <div ng-if="detail.val2_isvalue == 1" ng-class="{'col-md-2 col-sm-3' : detail.val2_isvalue == 1}">
                                                                    <div ng-if="detail.val2Validate != 1">
                                                                        <input name="value2"  type="text" ng-model="infoD.VAL2_VALUE[detail.detail_id]" class="form-control">
                                                                        </div>
                                                                        <div ng-if="detail.val2Validate == 1">
                                                                            <input name="value2" ng-pattern="/^[0-9]+$/" type="text" ng-model="infoD.VAL2_VALUE[detail.detail_id]" ng-change="mathScore(detail.detail_id,line.line_id,line.line_isscore1,line.line_israting1,line.line_isscore2,line.line_israting2,line.score_type1,line.score_type2,line.rating_id2)" class="form-control">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div ng-if="detail.val2_ischeckbox == 1" ng-class="{'col-md-1 col-sm-1' : detail.val2_ischeckbox == 1}">
                                                                        <input class="form-control" ng-model="infoD.VAL2_CHECKBOX[detail.detail_id]" type="checkbox" ng-checked="infoD.VAL2_CHECKBOX[detail.detail_id]==1"/>
                                                                    </div>
                                                                    <div ng-if="detail.val2_ischeckbox == 2" ng-class="{'col-md-6 col-lg-4 col-sm-6' : detail.val2_ischeckbox == 2}">
                                                                        <div class="btn-group ">
                                                                            <label class="btn">
                                                                                <input type="radio" ng-model="infoD.VAL2_CHECKBOX[detail.detail_id]" value="0" /> UNABLE
                                                                            </label>
                                                                            <label class="btn">
                                                                                <input type="radio" ng-model="infoD.VAL2_CHECKBOX[detail.detail_id]" value="1" /> PARTIAL
                                                                            </label>
                                                                            <label class="btn">
                                                                                <input type="radio" ng-model="infoD.VAL2_CHECKBOX[detail.detail_id]" value="2" /> ABLE
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div ng-if="detail.val2_ischeckbox == 3" ng-class="{'col-md-2 col-sm-3' : detail.val2_ischeckbox == 3}">
                                                                        <div class="btn-group ">
                                                                            <label class="btn">
                                                                                <input type="radio" ng-model="infoD.VAL2_CHECKBOX[detail.detail_id]" value="0" /> Yes
                                                                            </label>
                                                                            <label class="btn">
                                                                                <input type="radio" ng-model="infoD.VAL2_CHECKBOX[detail.detail_id]" value="1"/> No
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div ng-class="{'has-error':showClickedValidation  && numberForm.comment.$invalid}">
                                                                        <div ng-if="detail.comment_text == 1">
                                                                            <div class="form-group col-sm-8 col-lg-5 col-md-6">
                                                                                <label class="col-md-3 col-lg-2 col-sm-3" style="margin-top: 5px">
                                                                                Comment
                                                                                </label>
                                                                                <div class="col-md-8 col-lg-10 col-sm-9" style="margin-top: 5px">
                                                                                    <input name="comment"
                                                                                    ng-required="((infoD.VAL1_CHECKBOX[detail.detail_id]==false || infoD.VAL1_CHECKBOX[detail.detail_id] == null) && detail.val1_no ==1)||
                                                                   ((infoD.VAL2_CHECKBOX[detail.detail_id]==false || infoD.VAL2_CHECKBOX[detail.detail_id] == null) && detail.val2_no ==1) ||
                                                                   (infoD.VAL2_CHECKBOX[detail.detail_id] == true && detail.val2_yes == 1) || (infoD.VAL1_CHECKBOX[detail.detail_id] == true && detail.val1_yes == 1)"
                                                                                    type="text" ng-model="infoD.COMMENTS[detail.detail_id]" class="form-control">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div ng-show="showClickedValidation && (numberForm.value2.$error.pattern || numberForm.value1.$error.pattern || numberForm.comment.$invalid)">
                                                                        <div class="row">
                                                                            <div ng-if="detail.val1_name != null" ng-class="{'col-md-3 col-lg-2 col-sm-3' : detail.val1_name != null && detail.val1_name.length >= 5, 'col-md-1 col-sm-1': detail.val1_name != null && detail.val1_name.length < 5}">
                                                                            </div>
                                                                            <div ng-if="detail.val1_isvalue == 1" ng-class="{'col-md-2 col-sm-3' : detail.val1_isvalue == 1}">
                                                                                <label style="color: #8b0000"  ng-show="showClickedValidation && numberForm.value1.$error.pattern ">Must be number</label>
                                                                            </div>
                                                                            <div ng-if="detail.val1_ischeckbox == 1"  ng-class="{'col-md-1 col-sm-1' : detail.val1_ischeckbox == 1}"></div>
                                                                            <div ng-if="detail.val1_ischeckbox == 2" ng-class="{'col-md-4 col-sm-6' : detail.val1_ischeckbox == 2}"> </div>
                                                                            <div ng-if="detail.val1_ischeckbox == 3" ng-class="{'col-md-2 col-sm-3' : detail.val1_ischeckbox == 3}"></div>
                                                                            <div ng-if="detail.val2_name != null" ng-class="{'col-md-3 col-lg-2 col-sm-3' : detail.val2_name != null && detail.val2_name.length >= 5, 'col-md-1 col-sm-1': detail.val2_name != null && detail.val2_name.length < 5}"></div>
                                                                            <div ng-if="detail.val2_isvalue == 1" ng-class="{'col-md-2 col-sm-3' : detail.val2_isvalue == 1}">
                                                                                <label style="color: #8b0000"  ng-show="showClickedValidation && numberForm.value2.$error.pattern">Must be number</label>
                                                                            </div>
                                                                            <div ng-if="detail.val2_ischeckbox == 1" ng-class="{'col-md-1 col-sm-1' : detail.val2_ischeckbox == 1}"></div>
                                                                            <div ng-if="detail.val2_ischeckbox == 2" ng-class="{'col-md-4 col-sm-6' : detail.val2_ischeckbox == 2}"></div>
                                                                            <div ng-if="detail.val2_ischeckbox == 3" ng-class="{'col-md-2 col-sm-3' : detail.val2_ischeckbox == 3}"></div>
                                                                            <div ng-if="detail.comment_text == 1">
                                                                                <div class="form-group col-sm-8 col-md-6">
                                                                                    <label class="col-md-3 col-sm-3" style="margin-top: 5px"></label>
                                                                                    <div class="col-md-8 col-sm-9" style="margin-top: 5px">
                                                                                        <label style="color: #8b0000"  ng-show="showClickedValidation && numberForm.comment.$invalid ">Must be enter</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </ng-form>
                                                            </div>

                                                            <div ng-if="line.line_isscore1 == 1">
                                                                <div ng-if="line.line_israting1 == 1">
                                                                    <div ng-if="line.score_type1 == 3">
                                                                        <div class="row" style="margin-top: 15px">
                                                                            <div class="col-md-3 col-lg-2 col-sm-3">
                                                                                <label  style="margin-top: 5px" class="pull-right" >Score(AVG)</label>
                                                                            </div>
                                                                            <div class="col-md-2 col-sm-3">
                                                                                <input type="text" ng-model="infoL.SCORE1[line.line_id]" readonly class="form-control">
                                                                                </div>
                                                                                <div ng-if="line.line_isscore2 == 1 && line.line_israting2 == 1 && line.score_type2 == 3">
                                                                                    <div class="col-md-3 col-lg-2 col-sm-3">
                                                                                        <label  style="margin-top: 5px" class="pull-right" >Score(AVG)</label>
                                                                                    </div>
                                                                                    <div class="col-md-2 col-sm-3">
                                                                                        <input type="text" readonly ng-model="infoL.SCORE2[line.line_id]" class="form-control">
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="row" style="margin-top: 15px">
                                                                                    <div class="col-md-3 col-lg-2 col-sm-3">
                                                                                        <label  style="margin-top: 5px" class="pull-right" >Rating</label>
                                                                                    </div>
                                                                                    <div class="col-md-2 col-sm-3">
                                                                                        <input type="text" ng-model="infoL.RATE1[line.line_id]" readonly class="form-control">
                                                                                            <div ng-model="infoL.RATING_VALUE1[line.line_id]"></div>
                                                                                        </div>
                                                                                        <div ng-if="line.line_isscore2 == 1 && line.line_israting2 == 1 && line.score_type2 == 3">
                                                                                            <div class="col-md-3 col-lg-2 col-sm-3">
                                                                                                <label  style="margin-top: 5px" class="pull-right" >Rating</label>
                                                                                            </div>
                                                                                            <div class="col-md-2 col-sm-3">
                                                                                                <input type="text" readonly ng-model="infoL.RATE2[line.line_id]" class="form-control">
                                                                                                    <div ng-model="infoL.RATING_VALUE2[line.line_id]"></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div ng-if="line.score_type1 == 4">
                                                                                        <div class="row" style="margin-top: 15px">
                                                                                            <div class="col-md-1 col-sm-1">
                                                                                                <label  style="margin-top: 5px" class="pull-right" >Rating</label>
                                                                                            </div>
                                                                                            <div class="col-md-2 col-sm-3">
                                                                                                <input type="text" ng-model="infoL.RATE1[line.line_id]" readonly class="form-control">
                                                                                                    <div ng-model="infoL.RATING_VALUE1[line.line_id]"></div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="row" style="margin-left: 50px">
                                                                                                <label class="bold control-label col-md-10 col-sm-10">Age predicted max HR max: {{maxA = 220 - age}} </label></br>
                                                                                            <label class="text-info control-label col-md-10 col-sm-10">85% Max HR: {{maxA * 85 / 100}} bpm</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div ng-if="line.score_type1 == 6">
                                                                                        <div class="row" style="margin-top: 15px">
                                                                                            <div class="col-md-3 col-lg-2 col-sm-3">
                                                                                                <label  style="margin-top: 5px" class="pull-right" >Rating</label>
                                                                                            </div>
                                                                                            <div class="col-md-2 col-sm-3">
                                                                                                <input type="text" ng-model="infoL.RATE1[line.line_id]" readonly class="form-control">
                                                                                                    <div ng-model="infoL.RATING_VALUE1[line.line_id]"></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div ng-if="line.score_type1 == 8">
                                                                                            <div class="row" style="margin-top: 15px">
                                                                                                <div class="col-md-2 col-sm-3">
                                                                                                    <label  style="margin-top: 5px" class="pull-right" >Score/Rating: </label>
                                                                                                </div>
                                                                                                <div class="col-md-10 col-sm-9">
                                                                                                    <div class="btn-group ">
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoL.RATING_VALUE1[line.line_id]" ng-change="rate(line.line_id)" value="4"/> EXCELLENT
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoL.RATING_VALUE1[line.line_id]" ng-change="rate(line.line_id)" value="3"/> GOOD
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoL.RATING_VALUE1[line.line_id]" ng-change="rate(line.line_id)" value="2"/> FAIR
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoL.RATING_VALUE1[line.line_id]" ng-change="rate(line.line_id)" value="1"/> POOR
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div ng-if="line.line_israting1 == 0">
                                                                                        <div ng-if="line.score_type1 == 7">
                                                                                            <div class="row"  style="margin-top: 15px">
                                                                                                <div class="col-md-3 col-lg-2 col-sm-3">
                                                                                                    <label  style="margin-top: 5px" class="pull-right" >Score/Rating</label>
                                                                                                </div>
                                                                                                <div class="col-md-7 col-sm-8">
                                                                                                    <div class="btn-group ">
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoL.SCORE1[line.line_id]" value="0"/> UNABLE
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoL.SCORE1[line.line_id]" value="1"/> PARTIAL
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoL.SCORE1[line.line_id]" value="2"/> ABLE
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div ng-if="line.score_type1 == 9">
                                                                                            <div class="row"  style="margin-top: 15px">
                                                                                                <div class="col-md-3 col-lg-2 col-sm-3">
                                                                                                    <label class="pull-right">Manage </label>
                                                                                                </div>
                                                                                                <div class="col-md-2 col-sm-3">
                                                                                                    <input type="text" ng-model="manage[line.line_id]" readonly style="width: 50px;background-color: lightgrey"><label>kg</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="row"  style="margin-top: 15px">
                                                                                                    <div class="col-md-3 col-lg-2 col-sm-3">
                                                                                                        <label  style="margin-top: 5px" class="pull-right" >Score/Rating</label>
                                                                                                    </div>
                                                                                                    <div class="col-md-7 col-sm-8">
                                                                                                        <div class="btn-group ">
                                                                                                            <label class="btn">
                                                                                                                <input type="radio" ng-model="infoL.SCORE1[line.line_id]" value="0"/> UNABLE
                                                                                                            </label>
                                                                                                            <label class="btn">
                                                                                                                <input type="radio" ng-model="infoL.SCORE1[line.line_id]" value="1"/> PARTIAL
                                                                                                            </label>
                                                                                                            <label class="btn">
                                                                                                                <input type="radio" ng-model="infoL.SCORE1[line.line_id]" value="2"/> ABLE
                                                                                                            </label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </br>
                                                                                <div ng-class="{'panel panel-default' : line.comment.length > 0}" >
                                                                                    <div ng-class="{'panel-body' : line.comment.length > 0}">
                                                                                        <label ng-if="line.comment.length > 0" class="control-label bold">Question Comments</label>
                                                                                        <div ng-repeat="nameC in line.comment">
                                                                                            <div class="row">
                                                                                                <div class="col-md-5 col-sm-7">
                                                                                                    <label ng-if="nameC.comment_name != 'null'" class="text-info control-label" style="margin-top: 10px"> {{nameC.comment_name}} </label>
                                                                                                </div>
                                                                                                <div ng-if="nameC.comment_type == 1" ng-class="{'col-md-1 col-sm-1' : nameC.comment_type == 1}">
                                                                                                    <input class="form-control" ng-model="infoC.VALUE[nameC.comment_id]" type="checkbox" ng-checked="infoC.VALUE[nameC.comment_id] == 1"/>
                                                                                                </div>
                                                                                                <div ng-if="nameC.comment_type == 3" ng-class="{'col-md-2 col-sm-3' : nameC.comment_type == 2}">
                                                                                                    <div class="btn-group " >
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="0"/> Yes
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="1"/> No
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div ng-if="nameC.comment_type == 4" ng-class="{'col-md-6 col-sm-6' : nameC.comment_type == 4}">
                                                                                                    <div class="btn-group " >
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="0"/> GOOD
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="1"/> AVERAGE
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="2"/> POOR
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div ng-if="nameC.comment_type == 5" ng-class="{'col-md-7 col-sm-8' : nameC.comment_type == 5}">
                                                                                                    <div class="btn-group " >
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="0"/> MINIMAL
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="1"/> MODERATE
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="2"/> MAXIMAL
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div ng-if="nameC.comment_type == 6" ng-class="{'col-md-11 col-lg-8' : nameC.comment_type == 6}">
                                                                                                    <div class="btn-group " >
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="0"/> Above Normal Range
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="1"/> Within Normal Range
                                                                                                        </label>
                                                                                                        <label class="btn">
                                                                                                            <input type="radio" ng-model="infoC.VALUE[nameC.comment_id]" value="2"/> Below Normal Range
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div ng-class="{'panel panel-default' : line.line_comment == 1}">
                                                                                    <div ng-class="{'panel-body' : line.line_comment == 1}">
                                                                                        <label ng-if="line.line_comment == 1" class="control-label bold">Question Comments</label>
                                                                                        <div class="row">
                                                                                            <div ng-if="line.line_comment == 1" ng-class="{'col-md-8' : line.line_comment == 1}">
                                                                                                <textarea  class="form-control" ng-model="infoL.COMMENTS[line.line_id]"></textarea>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>


                                                        <div class="caption">
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <p style="font-size: xx-large;text-align: center;font-weight: bolder">FUNCTIONAL ASSESSMENT SUMMARY</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div >
                                                            <div class="row" ng-repeat="section in header.section">
                                                                <div class="col-md-12" ng-repeat="line in section.line">
                                                                    <div class="portlet box grey-cascade"  ng-if="line.line_type == 1">
                                                                        <div class="portlet-title">
                                                                            <div class="caption" >
                                                                                <i class="fa fa-gift"></i> {{line.line_name}}
                                                                            </div>
                                                                            <div class="tools">
                                                                                <a href="javascript:;" class="collapse">
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        <div ng-if="line.line_isscore1 != 1" class="portlet-body" ng-repeat="detail in line.detail">
                                                                            <div class="row">
                                                                                <div class="col-md-3 col-sm-5">
                                                                                    <label class="bold" style="margin-top: 10px">{{detail.detail_name}}</label>
                                                                                </div>
                                                                                <div ng-if="detail.val1_name != null" ng-class="{'col-md-2 col-sm-3' : detail.val1_name != null}">
                                                                                    <label  style="margin-top: 10px" ng-class="{'pull-right' : detail.val1_name != null}" >
                                        {{detail.val1_name}}
                                                                                    </label>
                                                                                </div>
                                                                                <div ng-if="detail.val1_ischeckbox == 3" ng-class="{'col-md-3 col-lg-2 col-sm-3' : detail.val1_ischeckbox == 3}">
                                                                                    <div class="btn-group ">
                                                                                        <label class="btn">
                                                                                            <input type="radio" ng-model="infoD.VAL1_CHECKBOX[detail.detail_id]" value="0" /> Yes
                                                                                        </label>
                                                                                        <label class="btn">
                                                                                            <input type="radio"  ng-model="infoD.VAL1_CHECKBOX[detail.detail_id]" value="1" /> No
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div ng-if="detail.comment_text == 1">
                                                                                    <label class="col-md-1 col-sm-2" style="margin-top: 10px" >
                                                                                    Comment
                                                                                    </label>
                                                                                    <div class="col-md-3 col-lg-4 col-sm-8">
                                                                                        <textarea class="form-control" ng-model="infoD.COMMENTS[detail.detail_id]"></textarea>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div ng-if="line.line_isscore1 == 1  && line.score_type1 == 5" class="portlet-body">
                                                                            <div class="row">
                                                                                <div class="col-md-6 col-sm-6">
                                                                                </div>
                                                                                <div class="col-md-3 col-sm-3">
                                                                                    <label class="bold">Score</label>
                                                                                </div>
                                                                                <div class="col-md-3 col-sm-3">
                                                                                    <label class="bold">Rating</label>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row" ng-repeat="detail in line.detail">
                                                                                <div class="col-md-6 col-sm-6">
                                                                                    <label class="bold">{{detail.detail_name}}</label>
                                                                                </div>
                                                                                <div class="col-md-3 col-sm-3">
                                                                                    <label>{{infoD.VAL1_VALUE[detail.detail_id] =infoL.RATING_VALUE1[detail.summary]}}/4</label>
                                                                                </div>
                                                                                <div class="col-md-3 col-sm-3">
                                                                                    <label>{{infoD.VAL2_VALUE[detail.detail_id]=infoL.RATE1[detail.summary]}}</label>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-md-6 col-sm-6">
                                                                                    <label class="bold">Total</label>
                                                                                </div>
                                                                                <div class="col-md-3 col-sm-3">
                                                                                    <label class="bold">{{infoL.RATING_VALUE1[line.line_id]}}/{{line.detail.length * 4}}</label>
                                                                                </div>
                                                                                <div class="col-md-3 col-sm-3">
                                                                                    <label class="bold">{{infoL.RATE1[line.line_id]}}</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="panel panel-default">
                                                            <div class="panel-body">
                                                                <label class="control-label text-info bold">Risk Rating</label>
                                                                <div class="row">
                                                                    <label class="bold col-md-2 col-sm-2" style="margin-top: 10px">Risk Rating: </label>
                                                                    <div class="btn-group col-sm-9 col-md-9">
                                                                        <label class="btn">
                                                                            <input type="radio" ng-model="infoH.Risk" value="0"/> Low Risk
                                                                        </label>
                                                                        <label class="btn">
                                                                            <input type="radio" ng-model="infoH.Risk" value="1"/> Medium Risk
                                                                        </label>
                                                                        <label class="btn">
                                                                            <input type="radio" ng-model="infoH.Risk" value="2" /> High Risk
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <!--</br>-->
                                                                <div  ng-class="{'has-error':showClickedValidation && FAForm.recom.$invalid}">
                                                                    <div class="row">
                                                                        <label class="bold col-md-4">* Comments/Recommendations: </label>
                                                                        <div class="col-md-7">
                                                                            <textarea class="form-control" name="recom" required ng-model="infoH.Comments"></textarea>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row"  ng-show="showClickedValidation && FAForm.recom.$invalid">
                                                                        <label class="bold col-md-4"></label>
                                                                        <div class="col-md-3 help-block">
                                                                            <label>Must be enter</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <!--</br>-->
                                                                <div class="row">
                                                                    <label class="bold col-md-7 col-lg-5 col-sm-8" style="margin-top: 10px">Health and Rehab Coorinator Review Recommended: </label>
                                                                    <div class="col-md-5 col-sm-4">
                                                                        <div class="btn-group ">
                                                                            <label class="btn">
                                                                                <input type="radio"  ng-model="infoH.Recommend" value="0"  /> Yes
                                                                            </label>
                                                                            <label class="btn">
                                                                                <input type="radio"  ng-model="infoH.Recommend" value="1"  />  No
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <label class="control-label text-info bold">Additional Tests Attached: </label>
                                                                <div class="row">
                                                                    <div class="col-md-3 col-sm-3" style="margin-top: 10px">
                                                                        <label class="pull-right"> Flexibility</label>
                                                                    </div>
                                                                    <div class="col-md-1 col-sm-1">
                                                                        <input type="checkbox" ng-model="infoH.Att_Flexibility" ng-checked="infoH.Att_Flexibility == 1" class="form-control">
                                                                        </div>
                                                                        <div class="col-md-3 col-sm-3" style="margin-top: 10px">
                                                                            <label class="pull-right"> Score Stability</label>
                                                                        </div>
                                                                        <div class="col-md-1 col-sm-1">
                                                                            <input type="checkbox" ng-model="infoH.Att_Core_Stability" ng-checked="infoH.Att_Core_Stability == 1" class="form-control">
                                                                            </div>
                                                                            <div class="col-md-3 col-sm-3" style="margin-top: 10px">
                                                                                <label class="pull-right"> Wrist/elbow function</label>
                                                                            </div>
                                                                            <div class="col-md-1 col-sm-1">
                                                                                <input type="checkbox" ng-model="infoH.Att_Wirst_Elbow_func" ng-checked="infoH.Att_Wirst_Elbow_func == 1" class="form-control">
                                                                                </div>
                                                                            </div>
                                                                            <div class="row">
                                                                                <div class="col-md-3 col-sm-3" style="margin-top: 10px">
                                                                                    <label class="pull-right"> Shoulder function</label>
                                                                                </div>
                                                                                <div class="col-md-1 col-sm-1">
                                                                                    <input type="checkbox" ng-model="infoH.Att_Shoulder_func" ng-checked="infoH.Att_Shoulder_func == 1"  class="form-control">
                                                                                    </div>
                                                                                    <div class="col-md-3 col-sm-3" style="margin-top: 10px">
                                                                                        <label class="pull-right">Lower limb function</label>
                                                                                    </div>
                                                                                    <div class="col-md-1 col-sm-1">
                                                                                        <input type="checkbox"  ng-model="infoH.Att_Lower_Limb_func" ng-checked="infoH.Att_Lower_Limb_func == 1" class="form-control">
                                                                                        </div>
                                                                                        <div class="col-md-3 col-sm-3" style="margin-top: 10px">
                                                                                            <label class="pull-right">Balance</label>
                                                                                        </div>
                                                                                        <div class="col-md-1 col-sm-1">
                                                                                            <input type="checkbox"  ng-model="infoH.Att_Balance" ng-checked="infoH.Att_Balance == 1" class="form-control">
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="row">
                                                                                            <div class="col-md-7 col-sm-7">
                                                                                                <div class="col-md-2 col-sm-2">
                                                                                                    <a href="javascript:;" ng-click="showSignature()" ng-show="!isSignature"
                                                                                                    class="btn green">Signature</a>
                                                                                                </div>
                                                                                                <div class="col-md-10 col-sm-10"
                                                                                                ng-show="infoH.ASSESSED_SIGN!=null && infoH.ASSESSED_SIGN!='' && !isSignature">
                                                                                                    <img src="" ng-src="{{infoH.ASSESSED_SIGN}}" alt=""
                                                                                                    style="width: 200px;height: 150px;"/>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="row" style="text-align: center;" ng-show="isSignature">
                                                                                            <div class="col-md-12 col-sm-12">
                                                                                                <canvas width="500" height="400" id="canvas"
                                                                                                signature ng-model="infoH.ASSESSED_SIGN" style="background-color: #8eece8">
                                                                                                </canvas>
                                                                                            </div>
                                                                                            <div class="col-md-12 col-sm-12">
                                                                                                <div class="break-row"></div>
                                                                                                <div class="btn-group">
                                                                                                    <button type="button" ng-click="cancelClick()" class="btn btn-danger btn-sm">
                                                                                                    Cancel
                                                                                                    </button>
                                                                                                    <button type="button" ng-click="clearClick()" class="btn btn-warning btn-sm">Clear
                                                                                                    </button>
                                                                                                    <button type="button" ng-click="okClick()" class="btn green btn-sm">Ok</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </form>



