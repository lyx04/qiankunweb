<template>
  <div class="main-content">
    <div class="monitor-title">
      <i></i>{{ $route.params.orgName }} - {{ $route.params.roomName }} -
      {{ $route.params.cabinetsName ? $route.params.cabinetsName + " - " : "" }}
      {{ $route.params.name }}
    </div>
    <!--参数-->
    <div class="monitor-parameter">
      <!--基本参数-->
      <div class="monitor-basic-parameters">
        <!--四角-->
        <div class="angle angle-left-top"></div>
        <div class="angle angle-left-bottom"></div>
        <div class="angle angle-right-top"></div>
        <div class="angle angle-right-bottom"></div>
        <!--内容-->
        <div class="monitor-basic-content">
          <ul>
            <li>
              <el-col :span="4"
                ><div
                  class="monitor-basic-content-item monitor-basic-content-item-first"
                ></div
              ></el-col>
              <el-col :span="4"
                ><div class="monitor-basic-content-item">总</div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">A相(ab)</div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">B相(bc)</div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">C相(ca)</div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">平均</div></el-col
              >
            </li>
            <li>
              <el-col :span="4"
                ><div
                  class="monitor-basic-content-item monitor-basic-content-item-first"
                >
                  相电压(V)
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item"></div
              ></el-col>
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[0].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[0].value)"
                    @click="basicClick(measurementMarkList[0], 'A相电压')"
                    >{{ String(measurementMarkList[0].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels === measurementMarkList[1].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[1].value)"
                    @click="basicClick(measurementMarkList[1], 'B相电压')"
                  >
                    {{ String(measurementMarkList[1].value) || "--" }}
                  </span>
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[2].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[2].value)"
                    @click="basicClick(measurementMarkList[2], 'C相电压')"
                    >{{ String(measurementMarkList[2].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[3].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[3].value)"
                    @click="basicClick(measurementMarkList[3], '平均相电压')"
                    >{{ String(measurementMarkList[3].value) || "--" }}</span
                  >
                </div></el-col
              >
            </li>
            <li>
              <el-col :span="4"
                ><div
                  class="monitor-basic-content-item monitor-basic-content-item-first"
                >
                  线电压(V)
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item"></div
              ></el-col>
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[4].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[4].value)"
                    @click="basicClick(measurementMarkList[4], 'AB线电压')"
                    >{{ String(measurementMarkList[4].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[5].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[5].value)"
                    @click="basicClick(measurementMarkList[5], 'BC线电压')"
                    >{{ String(measurementMarkList[5].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[6].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[6].value)"
                    @click="basicClick(measurementMarkList[6], 'CA线电压')"
                    >{{ String(measurementMarkList[6].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[7].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[7].value)"
                    @click="basicClick(measurementMarkList[7], '平均线电压')"
                    >{{ String(measurementMarkList[7].value) || "--" }}</span
                  >
                </div></el-col
              >
            </li>
            <li>
              <el-col :span="4"
                ><div
                  class="monitor-basic-content-item monitor-basic-content-item-first"
                >
                  电流(A)
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item"></div
              ></el-col>
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[8].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[8].value)"
                    @click="basicClick(measurementMarkList[8], 'A相电流')"
                    >{{ String(measurementMarkList[8].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[9].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[9].value)"
                    @click="basicClick(measurementMarkList[9], 'B相电流')"
                    >{{ String(measurementMarkList[9].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[10].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[10].value)"
                    @click="basicClick(measurementMarkList[10], 'C相电流')"
                    >{{ String(measurementMarkList[10].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[11].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[11].value)"
                    @click="basicClick(measurementMarkList[11], '平均相电流')"
                    >{{ String(measurementMarkList[11].value) || "--" }}</span
                  >
                </div></el-col
              >
            </li>
            <li>
              <el-col :span="4"
                ><div
                  class="monitor-basic-content-item monitor-basic-content-item-first"
                >
                  有功功率(kW)
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[15].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[15].value)"
                    @click="basicClick(measurementMarkList[15], '总有功功率')"
                    >{{ String(measurementMarkList[15].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[12].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[12].value)"
                    @click="basicClick(measurementMarkList[12], 'A相有功功率')"
                    >{{ String(measurementMarkList[12].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[13].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[13].value)"
                    @click="basicClick(measurementMarkList[13], 'B相有功功率')"
                    >{{ String(measurementMarkList[13].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[14].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[14].value)"
                    @click="basicClick(measurementMarkList[14], 'C相有功功率')"
                    >{{ String(measurementMarkList[14].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item"></div
              ></el-col>
            </li>
            <li>
              <el-col :span="4"
                ><div
                  class="monitor-basic-content-item monitor-basic-content-item-first"
                >
                  无功功率(kVar)
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[19].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[19].value)"
                    @click="basicClick(measurementMarkList[19], '总无功功率')"
                    >{{ String(measurementMarkList[19].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[16].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[16].value)"
                    @click="basicClick(measurementMarkList[16], 'A相无功功率')"
                    >{{ String(measurementMarkList[16].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[17].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[17].value)"
                    @click="basicClick(measurementMarkList[17], 'B相无功功率')"
                    >{{ String(measurementMarkList[17].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[18].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[18].value)"
                    @click="basicClick(measurementMarkList[18], 'C相无功功率')"
                    >{{ String(measurementMarkList[18].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item"></div
              ></el-col>
            </li>
            <li>
              <el-col :span="4"
                ><div
                  class="monitor-basic-content-item monitor-basic-content-item-first"
                >
                  视在功率(kVA)
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[23].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[23].value)"
                    @click="basicClick(measurementMarkList[23], '总视在功率')"
                    >{{ String(measurementMarkList[23].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[20].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[20].value)"
                    @click="basicClick(measurementMarkList[20], 'A相视在功率')"
                    >{{ String(measurementMarkList[20].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[21].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[21].value)"
                    @click="basicClick(measurementMarkList[21], 'B相视在功率')"
                    >{{ String(measurementMarkList[21].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[22].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[22].value)"
                    @click="basicClick(measurementMarkList[22], 'C相视在功率')"
                    >{{ String(measurementMarkList[22].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item"></div
              ></el-col>
            </li>
            <li>
              <el-col :span="4"
                ><div
                  class="monitor-basic-content-item monitor-basic-content-item-first"
                >
                  功率因数
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[27].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[27].value)"
                    @click="basicClick(measurementMarkList[27], '总功率因数')"
                    >{{ String(measurementMarkList[27].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[24].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[24].value)"
                    @click="basicClick(measurementMarkList[24], 'A相功率因数')"
                    >{{ String(measurementMarkList[24].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[25].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[25].value)"
                    @click="basicClick(measurementMarkList[25], 'B相功率因数')"
                    >{{ String(measurementMarkList[25].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item">
                  <span
                    :class="
                      request.labels == measurementMarkList[26].labels
                        ? 'active'
                        : ''
                    "
                    :title="String(measurementMarkList[26].value)"
                    @click="basicClick(measurementMarkList[26], 'C相功率因数')"
                    >{{ String(measurementMarkList[26].value) || "--" }}</span
                  >
                </div></el-col
              >
              <el-col :span="4"
                ><div class="monitor-basic-content-item"></div
              ></el-col>
            </li>
          </ul>
        </div>
      </div>
      <!--更多参数-->
      <div class="monitor-all-parameters">
        <!--四角-->
        <div class="angle angle-left-top"></div>
        <div class="angle angle-left-bottom"></div>
        <div class="angle angle-right-top"></div>
        <div class="angle angle-right-bottom"></div>
        <!--内容-->
        <div class="monitor-all-content">
          <div class="monitor-all-content-more">
            <span @click="parameterMoreClick"
              >更多参数<i class="el-icon-d-arrow-right"></i
            ></span>
          </div>
          <ul v-if="parameterList.length > 0">
            <li v-for="(item, index) in parameterList" :key="index">
              <div class="monitor-parameter-content-name">
                {{ item.name }}{{ item.unit ? "(" + item.unit + ")" : "" }}
              </div>
              <div
                v-if="item.type == 2"
                :class="
                  request.labels == item.labels
                    ? 'active monitor-parameter-content-labels'
                    : 'monitor-parameter-content-labels'
                "
                @click="basicClick(item, item.name)"
              >
                {{ String(item.value) || "--" }}
              </div>
              <div
                v-if="item.type == 1"
                class="monitor-parameter-content-labels"
                style="cursor: no-drop;"
              >
                {{ String(item.value) || "--" }}
              </div>
            </li>
          </ul>
          <div v-else style="text-align: center;line-height: 200px;">
            暂无更多参数，<span
              style="color: #4efcfc;cursor: pointer;"
              @click="parameterMoreClick"
              ><i class="el-icon-circle-plus" style="margin: 0 6px;"></i
              >添加更多参数</span
            >
          </div>
        </div>
      </div>
    </div>
    <!--历时曲线-->
    <div class="monitor-curve">
      <!--四角-->
      <div class="angle angle-left-bottom"></div>
      <div class="angle angle-right-bottom"></div>
      <!--标题-->
      <div class="monitor-curve-title">
        历史曲线
        <el-popover
          placement="top-start"
          title="数据展示说明"
          width="290"
          trigger="hover"
          popper-class="monitor-curve-popover"
        >
          <div>
            <div>
              分钟，时段可筛选到分钟级别，最多可查看最近24小时的数据，按照网关采集的数据全量展示。
            </div>
            <div>
              日，按照15分钟一个点展示，展示的为上一个15分钟截止的上一个采集点的数值。
            </div>
            <div>
              月，按照日一个点展示，展示的为当天采集数据的最大值、最小值或者平均值，可切换值展示。
            </div>
          </div>
          <i
            slot="reference"
            class="monitor-curve-title-icon el-icon-question"
          ></i>
        </el-popover>
      </div>
      <!--筛选-->
      <div class="monitor-curve-screen">
        <el-form
          :model="request"
          ref="request"
          label-width="auto"
          class="filter-form"
        >
          <div class="monitor-curve-screen-title monitor-curve-screen-input">
            {{ request.name }}
          </div>
          <div class="monitor-curve-screen-input" style="width: 168px">
            <el-form-item label="周期:" prop="cycle">
              <el-select
                v-model="request.cycle"
                size="small"
                placeholder="请选择周期"
                @change="cycleChange"
              >
                <el-option label="日" value="1"></el-option>
                <el-option label="月" value="2"></el-option>
                <el-option label="分钟" value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div
            class="monitor-curve-screen-input"
            style="width: 200px"
            v-if="request.cycle == 1"
          >
            <el-form-item label="时间:" prop="day">
              <el-date-picker
                v-model="request.day"
                type="date"
                placeholder="选择时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :clearable="false"
                :editable="false"
                size="small"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div
            class="monitor-curve-screen-input"
            style="width: 200px"
            v-if="request.cycle == 2"
          >
            <el-form-item label="时间:" prop="day">
              <el-date-picker
                v-model="request.month"
                type="month"
                placeholder="选择时间"
                value-format="yyyy-MM"
                format="yyyy-MM"
                :clearable="false"
                :editable="false"
                size="small"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="monitor-curve-screen-input" v-if="request.cycle == 3">
            <el-form-item label="时间:" prop="date">
              <el-date-picker
                v-model="request.dateDay"
                type="date"
                placeholder="选择时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :clearable="false"
                :editable="false"
                size="small"
                style="width: 168px"
                :picker-options="pickerOptions"
                @change="dateDayChange"
              >
              </el-date-picker>
              <el-time-picker
                placeholder="开始时间"
                v-model="request.startTime"
                size="small"
                :clearable="false"
                :editable="false"
                value-format="HH:mm"
                format="HH:mm"
                style="width: 168px;margin-left: 10px;"
                :picker-options="{
                  selectableRange:
                    '00:00:00-' +
                    (request.endTime
                      ? request.endTime + ':00'
                      : this.jstool.jshandle.getTimestamp(this.request.dateDay) <
                        this.jstool.jshandle.getTimestamp(this.jstool.jshandle.getcurrentTime('yyyy-MM-dd'))
                      ? '23:59:59'
                      : this.jstool.jshandle.getcurrentTime('HH:mm:ss'))
                }"
              >
              </el-time-picker>
              至
              <el-time-picker
                placeholder="结束时间"
                v-model="request.endTime"
                size="small"
                :clearable="false"
                :editable="false"
                value-format="HH:mm"
                format="HH:mm"
                style="width: 168px;"
                :picker-options="{
                  selectableRange:
                    (request.startTime
                      ? request.startTime + ':00'
                      : '00:00:00') +
                    '-' +
                    (this.jstool.jshandle.getTimestamp(this.request.dateDay) <
                    this.jstool.jshandle.getTimestamp(this.jstool.jshandle.getcurrentTime('yyyy-MM-dd'))
                      ? '23:59:59'
                      : this.jstool.jshandle.getcurrentTime('HH:mm:ss'))
                }"
              >
              </el-time-picker>
            </el-form-item>
          </div>
          <div
            class="monitor-curve-screen-input"
            style="width: 168px"
            v-if="request.cycle == 2 && list.indexOf(request.labels) == -1"
          >
            <el-select
              v-model="request.value"
              size="small"
              placeholder="请选择"
            >
              <el-option label="最大值" value="max"></el-option>
              <el-option
                label="最小值"
                value="min"
                v-if="!electricityFilter"
              ></el-option>
              <el-option
                label="平均值"
                value="avg"
                v-if="!electricityFilter"
              ></el-option>
            </el-select>
          </div>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form>
      </div>
      <!--echars曲线-->
      <div id="c3" ref="c3" class="chart-statistics" style="width: 100%;"></div>
    </div>
    <!--更多参数弹框-->
    <modal
      :visible="dialogVisibleParameter"
      customClass="customer-modal Miniform"
      :destroyOnClose="false"
      :width="width"
      @on-closed="parameterClosed"
    >
      <template slot="head">
        <span>请选择参数</span>
      </template>
      <template slot="body">
        <el-checkbox-group
          v-model="checkParameterList"
          class="parameter-checkbox"
        >
          <template v-for="(item, index) in allParameterList">
            <el-checkbox :key="index" :label="Number(item.id)"
              ><span :title="item.name">{{ item.name }}</span></el-checkbox
            >
          </template>
          <div
            v-if="allParameterList.length == 0"
            style="font-size: 14px;color: #FFFFFF;margin:36px auto;"
          >
            暂无更多参数
          </div>
        </el-checkbox-group>
      </template>
      <template slot="foot">
        <el-button
          type="danger"
          @click="deleteSubmit"
          style="position:absolute;left: 20px;"
          >清除</el-button
        >
        <el-button @click="parameterClosed">取消</el-button>
        <el-button type="primary" @click="submitParameter">提交</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import * as ConstVal from "./config/measurementMark";
import * as conval from "./config/electricityLabers";
import modal from "hlcx-qiankun-commonservice/components/Modal";
import { Chart } from "@antv/g2";
import { GET_INTERVAL_MEASURE } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import {
  SAVE_MONITOR_EQUIPMENT,
  GET_MONITOR_EQUIPMENT,
  GET_MONITOR_ALARM_BY_METER,
  GET_MONITOR_HISTORY_LIST_BY_15MINUTE,
  GET_MONITOR_HISTORY_LIST_BY_Day,
  GET_MONITOR_HISTORY_LIST,
  GET_HISTORY_LASTESTLIST
} from "hlcx-qiankun-commonservice/utils/api/monitor/monitor";

export default {
  name: "detailsMonitor",
  components: { modal },
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > Date.now() - 8.64e6;
        }
      },
      // 详情基本量测量
      measurementMarkList: ConstVal.MEASUREMENT_MARK_LIST,
      // 电能量测量
      electricityList: conval.ELECTRICITY_LIST,
      topic: "", // pkey -sn
      // 更多参数
      moreMarkList: ConstVal.MORE_MEASUREMENT_MARK_LIST,
      parameterList: [],
      //  更多参数弹框
      dialogVisibleParameter: false,
      // 更多参数弹框
      width: "600px",
      checkParameterList: [],
      allParameterList: [], //所有量测量
      //  历史曲线
      request: {
        labels: "Ua",
        meterId: "",
        name: "A相电压",
        commId: "",
        sn: "",
        cycle: "1",
        value: "max",
        day: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd"), // 日
        month: this.jstool.jshandle.getcurrentTime("yyyy-MM"), // 月
        dateDay: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd"),
        startTime: "00:00",
        endTime: this.jstool.jshandle.getcurrentTime("HH:mm"),
        upperLimit: "", // 上限
        lowerLimit: "" // 下限
      },
      data3: {
        container: "c3", // 指定图表容器 ID
        autoFit: true,
        height: 277
      },
      chart3: {},
      chartData: [],
      list: ["Eptp", "Eqtp", "Tqtn", "TPtn", "KVAH"]
    };
  },
  computed: {
    electricityFilter() {
      return this.electricityList.includes(this.request.labels);
    }
  },
  destroyed() {
    if (this.topic) {
      window.mqttClient.removeListener("message", this.mqttMessage);
      window.mqttClient.unsubscribe(this.topic);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.topic) {
      window.mqttClient.removeListener("message", this.mqttMessage);
      window.mqttClient.unsubscribe(this.topic);
    }
    next();
  },
  methods: {
    // 周期切换为分钟并且切换日的时候
    dateDayChange(val) {
      if (
        this.jstool.jshandle.getTimestamp(val) >=
        this.jstool.jshandle.getTimestamp(this.jstool.jshandle.getcurrentTime("yyyy-MM-dd"))
      ) {
        this.request.startTime = "00:00";
        this.request.endTime = this.jstool.jshandle.getcurrentTime("HH:mm");
      }
    },
    //  点击基本信息量测量
    basicClick(item, name) {
      this.request.labels = item.labels;
      this.request.meterId = item.meterId;
      this.request.commId = item.commId;
      this.request.name = name;
      this.request.value = "max";
      this.chart3.clear(); // 清理所有图形
      this.getHistoryList(false);
    },
    //  点击更多参数
    parameterMoreClick() {
      this.dialogVisibleParameter = true;
      GET_INTERVAL_MEASURE(
        this.decode(this.$route.params.id),
        this.decode(this.$route.params.category)
      ).then(res => {
        this.checkParameterList = [];
        if (this.parameterList.length > 0) {
          this.parameterList.forEach(item => {
            this.checkParameterList.push(Number(item.measurementId));
          });
        }
        var result = res.data.filter(
          item =>
            !this.measurementMarkList.some(ele => ele.labels == item.labels)
        );
        result = result.filter(
          item => !this.moreMarkList.some(ele => ele.labels == item.labels)
        );
        var array = result.filter(item => {
          return item.labels != "DMDmaxTime" && item.labels != "DMDWTime";
        });
        this.allParameterList = array;
      });
    },
    //  关闭更多参数弹框
    parameterClosed() {
      this.dialogVisibleParameter = false;
    },
    // 清除更多参数
    deleteSubmit() {
      var data = {
        monitorEquipments: [],
        equipmentId: this.decode(this.$route.params.id)
      };
      this.checkParameterList = [];
      SAVE_MONITOR_EQUIPMENT(data).then(() => {
        this.$message({
          message: "清除成功",
          type: "success"
        });
        this.dialogVisibleParameter = false;
        this.getParameterList(true);
      });
    },
    //  确定提交参数
    submitParameter() {
      var data = {
        monitorEquipments: [],
        equipmentId: this.decode(this.$route.params.id)
      };
      this.checkParameterList.forEach(item => {
        this.allParameterList.forEach(val => {
          if (item == val.id) {
            data.monitorEquipments.push(val);
          }
        });
      });
      SAVE_MONITOR_EQUIPMENT(data).then(() => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.dialogVisibleParameter = false;
        this.getParameterList(true);
      });
    },
    // 查询更多参数
    getParameterList(state) {
      GET_MONITOR_EQUIPMENT(this.decode(this.$route.params.id)).then(res => {
        //由于pmc350-b的原因，di信号变位才会上送，所以有di信号的时候，通过接口主动取一下
        var result = res.data.filter(
          item => !this.moreMarkList.some(ele => ele.labels == item.labels)
        );
        result = this.moreMarkList.concat(result);
        var diObj = {},
          params = {
            names: "",
            tags: ""
          };
        result.forEach(item => {
          var labels = item.labels.toLowerCase();
          if (labels.indexOf("di") >= 0 && item.pKey == "PMC350") {
            diObj[item.sn + "_" + item.commId] = diObj[
              item.sn + "_" + item.commId
            ]
              ? (diObj[item.sn + "_" + item.commId] += "," + item.labels)
              : item.labels;
          }
          item.value = "";
        });
        if (Object.keys(diObj).length) {
          for (var i in diObj) {
            params.names = params.names.length ? (params.names += "," + i) : i;
            params.tags = params.tags.length
              ? (params.tags += "," + diObj[i])
              : diObj[i];
          }
          GET_HISTORY_LASTESTLIST(params).then(e => {
            for (var i in e.data) {
              var sn_dev = i.split("_");
              var res = {
                pKey: "PMC350",
                sn: sn_dev[0],
                devs: [{ dev: sn_dev[1], d: e.data[i] }]
              };
              this.gatewayToDraw(res);
            }
          });
        }
        this.parameterList = result;
        if (state && this.parameterList.length > 0) {
          this.equipmentMeasurement();
        }
      });
    },
    // 获取当前设备所有量测量(基本量测量)
    equipmentMeasurement() {
      GET_INTERVAL_MEASURE(
        this.decode(this.$route.params.id),
        this.decode(this.$route.params.category)
      ).then(res => {
        if (res.data.length > 0) {
          var topicList = [];
          res.data.forEach(item => {
            topicList.push("/edge/" + item.pKey + "/" + item.sn + "/rtg");
          });
          topicList = [...new Set(topicList)];
          this.topic = topicList[0];
          //循环参数列表
          this.measurementMarkList.forEach(item => {
            res.data.forEach(val => {
              if (item.labels == val.labels) {
                item.commId = val.commId;
                item.meterId = val.meterId;
              }
            });
          });
          this.moreMarkList.forEach(item => {
            res.data.forEach(val => {
              if (item.labels == val.labels) {
                item.commId = val.commId;
                item.meterId = val.meterId;
                item.unit = val.unit;
              }
            });
          });
          this.request.labels = this.measurementMarkList[0].labels;
          this.request.meterId = this.measurementMarkList[0].meterId;
          this.request.commId = this.measurementMarkList[0].commId;
          this.request.sn = res.data[0].sn;
          this.getHistoryList(true);
          this.subscribe();
          this.getParameterList();
        }
      });
    },
    // mqtt-------------------------------------
    // 订阅mqtt列表
    subscribe() {
      if (this.topic) {
        this.connectMqtt();
        window.mqttClient.unsubscribe(this.topic);
        window.mqttClient.subscribe(this.topic);
        window.mqttClient.unsubscribe("alarm/001/#");
        window.mqttClient.subscribe("alarm/001/#");
        var str = {
          ver: "v2.2.2",
          pKey: this.topic.split("/")[2],
          sn: this.topic.split("/")[3],
          type: "rtg",
          seq: new Date().getTime()
        };
        window.mqttClient.publish(
          `/cloud/${this.topic.split("/")[2]}/${
            this.topic.split("/")[3]
          }/rtg/call`,
          JSON.stringify(str)
        );
      } else {
        return false;
      }
    },
    // 接受mqtt返回数据
    connectMqtt() {
      window.mqttClient.addListener("message", this.mqttMessage);
    },
    mqttMessage(topic, message) {
      if (topic.indexOf("edge") >= 0) {
        var data = this.jstool.jshandle.mqttAdapter(topic, message);
        this.gatewayToDraw(data);
      }
      if (topic.indexOf("alarm") != -1) {
        var res = JSON.parse(message.toString());
        if (res.orgId == this.decode(this.$route.params.orgId)) {
          if (res.dev) {
            //量测量告警数据会有dev
            this.meterMonitorDetailsAlarm(res);
          } else {
            //网关 01掉线
            this.gatewayMonitorAlarm(res);
          }
        }
      }
    },
    //  处理mqtt数据
    gatewayToDraw(message) {
      var res = message;
      var topic = "/edge/" + res.pKey + "/" + res.sn + "/rtg";
      // 详情基本量测量
      if (this.topic == topic) {
        res.devs.forEach(i => {
          let mydevs = this.measurementMarkList.filter(j => {
            return j.commId == i.dev;
          });
          if (mydevs.length > 0) {
            mydevs.forEach(devItem => {
              i.d.forEach(ElemItem => {
                if (ElemItem.m == devItem.labels) {
                  if (ElemItem.dq && ElemItem.dq == 1) {
                    devItem.value = "";
                  } else {
                    devItem.value = ElemItem.v;
                  }
                }
              });
            });
          }
          if (this.parameterList.length > 0) {
            let parameterdevs = this.parameterList.filter(j => {
              return j.commId == i.dev;
            });
            if (parameterdevs.length > 0) {
              parameterdevs.forEach(devItem => {
                i.d.forEach(ElemItem => {
                  if (ElemItem.m == devItem.labels) {
                    if (ElemItem.dq && ElemItem.dq == 1) {
                      devItem.value = "";
                    } else {
                      devItem.value = ElemItem.v;
                    }
                  }
                });
              });
            }
          }
        });
      }
    },
    //表计掉线告警
    meterMonitorDetailsAlarm(message) {
      var res = message;
      if (res.alarmType == "01") {
        // 基本量测量判断sn
        if (this.topic && this.topic.indexOf(res.clientId) >= 0) {
          if (this.measurementMarkList.length) {
            this.measurementMarkList.forEach(item => {
              if (item.commId == res.dev) {
                item.value = "";
              }
            });
          }
          // 更多参数量测量判断sn
          this.parameterList.forEach(item => {
            if (item.commId == res.dev) {
              item.value = "";
            }
          });
        }
      }
    },
    //  网关掉线
    gatewayMonitorAlarm(message) {
      var res = message;
      if (res.alarmType == "01") {
        // 基本量测量判断sn
        if (this.topic && this.topic.indexOf(res.clientId) >= 0) {
          if (this.measurementMarkList.length) {
            this.measurementMarkList.forEach(item => {
              item.value = "";
            });
          }
          // 更多参数量测量判断sn
          this.parameterList.forEach(item => {
            item.value = "";
          });
        }
      }
    },
    //  历史曲线---------------------------------------------
    //  选择周期
    cycleChange() {
      this.chart3.clear(); // 清理所有图形
      this.getHistoryList(false);
    },
    //  搜索
    search() {
      this.chart3.clear(); // 清理所有图形
      this.getHistoryList(false);
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    //  曲线面积图
    curveChart() {
      this.$nextTick(() => {
        let data = this.chartData;
        this.chart3.data(data);
        this.chart3.axis("value", {
          label: {
            offset: 30,
            style: {
              fontSize: 14,
              textAlign: "center",
              fill: "#8A9ECF" // 文本颜色
            }
          },
          line: {
            stroke: "#1F63A3" // 网格线颜色
          },
          grid: {
            line: {
              type: "line",
              style: {
                stroke: "#1F63A3" // 网格线颜色
              }
            }
          }
        });
        this.chart3.axis("date", {
          label: {
            offset: 23,
            style: {
              fontSize: 14,
              textAlign: "center",
              fill: "#8A9ECF" // 文本颜色
            }
          },
          grid: {
            line: {
              type: "line",
              style: {
                stroke: "#1F63A3" // 网格线颜色
              }
            }
          }
        });
        this.chart3.scale({
          value: {
            nice: true,
            alias: this.request.name
          },
          date: {
            range: [0, 1],
            tickCount: 30,
            type: "cat"
          },
          upperLimit: {
            alias: "上限"
          },
          lowerLimit: {
            alias: "下限"
          }
        });
        this.chart3.tooltip({
          showCrosshairs: true,
          crosshairs: {
            type: "x",
            line: {
              style: {
                lineDash: [3, 3],
                stroke: "#ffffff",
                lineWidth: 2
              }
            }
          },
          domStyles: {
            "g2-tooltip-marker": {
              background: "#EF9734",
              borderRadius: "50%"
            },
            "g2-tooltip": {
              backgroundColor: "rgba(45, 76, 220, 0.4)",
              color: "#CAF2F5",
              fontSize: "12px",
              borderRadius: "4px",
              border: "1px solid #ffffff",
              boxShadow: "none"
            }
          }
        });
        if (data.length > 0) {
          if (data[0].upperLimit) {
            this.chart3.annotation().line({
              start: ["min", data[0].upperLimit],
              end: ["max", data[0].upperLimit],
              style: {
                stroke: "#3859ff",
                lineWidth: 2,
                lineDash: [3, 3]
              },
              text: {
                content: "上限" + data[0].upperLimit,
                position: "95%",
                style: {
                  fill: "#8A9ECF",
                  fontSize: 12,
                  textBaseline: "top",
                  textAlign: "center"
                }
              }
            });
          }
          if (data[0].lowerLimit) {
            this.chart3.annotation().line({
              start: ["min", data[0].lowerLimit],
              end: ["max", data[0].lowerLimit],
              style: {
                stroke: "#ff0000",
                lineWidth: 2,
                lineDash: [3, 3]
              },
              text: {
                position: "95%",
                style: {
                  fill: "#ff0000",
                  fontSize: 12,
                  textBaseline: "top",
                  textAlign: "center"
                },
                content: "下限" + data[0].lowerLimit
              }
            });
          }
          var array = data.concat([]).filter(item => {
            return item.v;
          });
          if (array.length > 2) {
            this.chart3.annotation().dataMarker({
              top: true,
              position: [
                array.sort(this.compare("value"))[0].date,
                array.sort(this.compare("value"))[0].value
              ],
              text: {
                content: array.sort(this.compare("value"))[0].value,
                background: {
                  padding: 7,
                  style: {
                    fill: "#00AEEF",
                    fillOpacity: 0.26,
                    lineWidth: 1,
                    stroke: "#43DBF1"
                  }
                },
                style: {
                  fill: "#FFFEFE",
                  fontSize: 12,
                  textBaseline: "top",
                  textAlign: "center"
                }
              },
              line: {
                length: 30
              }
            });
            this.chart3.annotation().dataMarker({
              top: true,
              position: [
                array.sort(this.compare("value"))[array.length - 1].date,
                array.sort(this.compare("value"))[array.length - 1].value
              ],
              text: {
                content: array.sort(this.compare("value"))[array.length - 1]
                  .value,
                background: {
                  padding: 7,
                  style: {
                    fill: "#00AEEF",
                    fillOpacity: 0.26,
                    lineWidth: 1,
                    stroke: "#43DBF1"
                  }
                },
                style: {
                  fill: "#FFFEFE",
                  fontSize: 12,
                  textBaseline: "top",
                  textAlign: "center"
                }
              },
              line: {
                length: 10
              }
            });
          }
          if (this.request.cycle == 3 && data.length > 96) {
            this.chart3.option("slider", {
              start: 0.0,
              end: 0.3,
              trendCfg: {
                isArea: false,
                smooth: true
              },
              textStyle: {
                fill: "#4efcfc",
                fontSize: 12,
                textBaseline: "top"
              }
            });
          } else {
            this.chart3.option("slider", false);
          }
        }
        this.chart3
          .line()
          .position("date*value")
          .shape("smooth")
          .color("#3859ff")
          .tooltip("value*upperLimit*lowerLimit");
        this.chart3
          .area()
          .position("date*value")
          .shape("smooth")
          .color("l(90) 0:#3859ff 1:#071652")
          .tooltip("value*upperLimit*lowerLimit");
        this.chart3.render();
      });
    },
    //  历史曲线
    getHistoryList(initialize) {
      if (this.request.meterId) {
        this.getMonitorAlarmbymeter(
          this.request.meterId,
          this.request.labels,
          initialize
        );
      }
    },
    //  获取表计某个量测量的告警信息
    getMonitorAlarmbymeter(meterId, labels, initialize) {
      GET_MONITOR_ALARM_BY_METER(meterId, labels)
        .then(res => {
          if (res.data) {
            this.request.upperLimit = res.data.upperLimit;
            this.request.lowerLimit = res.data.lowerLimit;
          } else {
            this.request.upperLimit = null;
            this.request.lowerLimit = null;
          }
          if (this.request.cycle == 1) {
            this.getHistoryBy15Minute(initialize);
          } else if (this.request.cycle == 2) {
            this.getHistoryByDay(initialize);
          } else if (this.request.cycle == 3) {
            this.getHistory(initialize);
          }
        })
        .catch(() => {
          if (this.request.cycle == 1) {
            this.getHistoryBy15Minute(initialize);
          } else if (this.request.cycle == 2) {
            this.getHistoryByDay(initialize);
          } else if (this.request.cycle == 3) {
            this.getHistory(initialize);
          }
        });
    },
    //  按15分钟历史数据查询
    getHistoryBy15Minute() {
      let data = {
        tag: this.request.labels,
        begintime: this.request.day,
        endTime: this.request.day,
        sn: this.request.sn,
        dev: this.request.commId
      };
      GET_MONITOR_HISTORY_LIST_BY_15MINUTE(data).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            if (this.request.upperLimit) {
              item.upperLimit = this.request.upperLimit;
            }
            if (this.request.lowerLimit) {
              item.lowerLimit = this.request.lowerLimit;
            }
            item.date = this.jstool.jshandle.filtertime(item.time, "HH:mm");
            item.value = item.v;
          });
          this.chart3.clear(); // 清理所有图形
          this.chartData = res.data;
          this.curveChart();
        }
      });
    },
    // 按日历史数据查询
    getHistoryByDay() {
      let data = {
        tag: this.request.labels,
        begintime: this.request.month,
        endTime: this.request.month,
        sn: this.request.sn,
        dev: this.request.commId,
        type: this.request.value
      };
      GET_MONITOR_HISTORY_LIST_BY_Day(data).then(res => {
        res.data.forEach(item => {
          if (this.request.upperLimit) {
            item.upperLimit = this.request.upperLimit;
          }
          if (this.request.lowerLimit) {
            item.lowerLimit = this.request.lowerLimit;
          }
          item.date = this.jstool.jshandle.filtertime(item.time, "yyyy-MM-dd");
          item.value = item.v;
        });
        this.chart3.clear(); // 清理所有图形
        this.chartData = res.data;
        this.curveChart();
      });
    },
    //  历史数据查询
    getHistory() {
      let data = {
        tag: this.request.labels,
        begintime: this.request.dateDay + " " + this.request.startTime,
        endTime: this.request.dateDay + " " + this.request.endTime,
        sn: this.request.sn,
        dev: this.request.commId
      };
      GET_MONITOR_HISTORY_LIST(data).then(res => {
        res.data.forEach(item => {
          if (this.request.upperLimit) {
            item.upperLimit = this.request.upperLimit;
          }
          if (this.request.lowerLimit) {
            item.lowerLimit = this.request.lowerLimit;
          }
          item.date = this.jstool.jshandle.filtertime(item.time, "HH:mm:ss");
          item.value = item.v;
        });
        this.chart3.clear(); // 清理所有图形
        this.chartData = res.data;
        this.curveChart();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.chart3 = new Chart(this.data3);
      this.equipmentMeasurement();
    });
  }
};
</script>

<style scoped lang="scss">
::v-deep.main-content {
  padding: 0 30px;
  font-size: 14px;
  .monitor-title {
    position: relative;
    margin: 29px 0 16px;
    i {
      display: inline-block;
      width: 9px;
      height: 9px;
      background-color: #2589ee;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .monitor-parameter {
    display: flex;
    justify-content: space-between;
    .monitor-basic-parameters {
      width: 56%;
      height: 405px;
      background: rgba(7, 23, 85, 0.8);
      border: 2px solid #1f63a3;
      position: relative;
      .monitor-basic-content {
        padding: 19px 20px 18px 20px;
        ul {
          li {
            width: 100%;
            height: 46px;
            line-height: 46px;
            .monitor-basic-content-item {
              padding: 0 5px;
              height: 46px;
              text-align: center;
              cursor: pointer;
              &.monitor-basic-content-item-first {
                text-align: left;
              }
              span {
                display: inline-block;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 22px;
                margin-top: 12px;
              }
              span.active {
                border: 1px dashed #fffc00;
                color: #fffc00;
                padding: 0 10px;
              }
            }
            &:nth-child(1n) {
              background-color: #0b2072;
            }
            &:nth-child(2n) {
              background-color: #0e2a90;
            }
          }
        }
      }
    }
    .monitor-all-parameters {
      width: 43%;
      height: 405px;
      background: rgba(7, 23, 85, 0.8);
      border: 2px solid #1f63a3;
      position: relative;
      .monitor-all-content {
        overflow-y: auto;
        max-height: 400px;
        .monitor-all-content-more {
          margin: 24px 28px 33px 0;
          color: #d5fdfd;
          font-size: 12px;
          text-align: right;
          span {
            cursor: pointer;
          }
          i {
            display: inline-block;
            margin-left: 9px;
          }
        }
        ul {
          display: flex;
          justify-content: space-between;
          flex-flow: wrap;
          padding: 0 35px;
          li {
            margin-bottom: 20px;
            .monitor-parameter-content-name {
              width: 180px;
              /*line-height: 23px;*/
              margin-right: 20px;
              display: inline-block;
              vertical-align: super;
            }
            .monitor-parameter-content-labels {
              width: 100px;
              display: inline-block;
              border-bottom: 1px dashed #ffffff;
              color: #fffc00;
              text-align: center;
              /*padding-bottom: 8px;*/
              cursor: pointer;
              line-height: 24px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &.active {
                border: 1px dashed #fffc00;
              }
            }
          }
        }
      }
    }
  }
  .monitor-curve {
    width: 100%;
    min-height: 384px;
    background: rgba(7, 22, 85, 0.8);
    border: 2px solid #1f63a3;
    margin: 15px 0 22px;
    position: relative;
    .monitor-curve-title {
      font-size: 16px;
      padding: 12px 0 8px 21px;
      border-bottom: 2px solid #1f63a3;
      .monitor-curve-title-icon {
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .monitor-curve-screen {
      padding: 0 25px 0 20px;
      .filter-form {
        margin: 20px 0 19px;
        .monitor-curve-screen-input {
          display: inline-block;
          margin-left: 30px;
          .el-form-item {
            margin-bottom: 0;
          }
          .el-form-item__label {
            padding-left: 0;
            line-height: 32px;
          }
          .el-input__inner {
            border: 1px solid #cccccc;
          }
          .el-form-item__content {
            line-height: 32px;
          }
          .el-date-editor.el-input {
            width: 100%;
          }
        }
        .el-button--primary {
          margin-left: 25px;
        }
      }
    }
    .chart-statistics {
      padding: 0 25px 0 20px;
      margin-bottom: 20px;
      canvas {
        /*width: 100% !important;*/
      }
    }
  }
}
::v-deep.parameter-checkbox {
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  .el-checkbox {
    width: 48%;
    margin-right: 0;
    padding: 0 5px;
    line-height: 30px;
    font-size: 12px;
    color: #ffffff;
    background-color: #1a4262;
    &:nth-child(4n - 1) {
      background-color: transparent;
    }
    &:nth-child(4n) {
      background-color: transparent;
    }
    .el-checkbox__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
      vertical-align: middle;
    }
  }
}
</style>
